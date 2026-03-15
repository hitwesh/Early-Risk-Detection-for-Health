import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  deleteAdminUser,
  downloadAdminUserHistoryReport,
  downloadAdminUserReport,
  getAdminStats,
  getAdminUsers,
} from "../services/auth.js";

const coercePercent = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  if (numeric <= 1) {
    return Math.round(numeric * 1000) / 10;
  }
  return Math.round(numeric * 10) / 10;
};

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [statsData, usersData] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
        ]);
        setStats(statsData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        if (usersData?.length) {
          setSelectedUserId(usersData[0].id);
          if (usersData[0].history?.length) {
            setSelectedEntryId(usersData[0].history[0].id);
          }
        }
      } catch (err) {
        if (err?.status === 403) {
          setError("Admin access required.");
          navigate("/user");
          return;
        } else if (err?.status === 401) {
          setError("Login required to view admin dashboard.");
          navigate("/login");
          return;
        } else {
          setError("Unable to load admin dashboard data.");
        }
        setStats(null);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [navigate]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) || users[0];
  const selectedHistory = selectedUser?.history ?? [];
  const selectedEntry =
    selectedHistory.find((entry) => entry.id === selectedEntryId) ||
    selectedHistory[0];

  const predictions = useMemo(() => {
    if (!selectedEntry || !Array.isArray(selectedEntry.diseases)) {
      return [];
    }
    return selectedEntry.diseases.map((disease, index) => ({
      disease,
      probability: coercePercent(selectedEntry.probabilities?.[index] ?? 0),
    }));
  }, [selectedEntry]);

  const handleDeleteUser = async (user) => {
    if (!user) {
      return;
    }
    const confirmed = window.confirm(
      `Disable ${user.email}? The account will be soft deleted.`,
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAdminUser(user.id);
      const refreshedUsers = await getAdminUsers();
      setUsers(Array.isArray(refreshedUsers) ? refreshedUsers : []);
      if (Array.isArray(refreshedUsers) && refreshedUsers.length > 0) {
        setSelectedUserId(refreshedUsers[0].id);
        setSelectedEntryId(refreshedUsers[0].history?.[0]?.id ?? null);
      } else {
        setSelectedUserId(null);
        setSelectedEntryId(null);
      }
    } catch (err) {
      setError("Unable to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadSelected = async () => {
    if (!selectedUser || !selectedEntry) {
      setDownloadError("Select a user and history entry first.");
      return;
    }
    setIsDownloading(true);
    setDownloadError("");
    try {
      await downloadAdminUserReport(selectedUser.id, selectedEntry.id);
    } catch (err) {
      setDownloadError("Unable to download the report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!selectedUser) {
      setDownloadError("Select a user first.");
      return;
    }
    if (!selectedHistory.length) {
      setDownloadError("No history available for this user.");
      return;
    }
    setIsDownloading(true);
    setDownloadError("");
    try {
      await downloadAdminUserHistoryReport(selectedUser.id);
    } catch (err) {
      setDownloadError("Unable to download the user history.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Monitoring Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review system usage, user activity, and individual diagnosis
            histories.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-white/70 p-6 text-sm text-rose-600 shadow-xl backdrop-blur-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Total Users
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {isLoading ? "--" : stats?.total_users ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Total Diagnoses
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {isLoading ? "--" : stats?.total_diagnoses ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Active Users
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {isLoading ? "--" : stats?.users_with_diagnoses ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Latest Diagnosis
              </p>
              <p className="mt-3 text-sm text-slate-700">
                {stats?.latest_diagnosis_at
                  ? new Date(stats.latest_diagnosis_at).toLocaleString()
                  : "No records"}
              </p>
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md md:col-span-1">
            <h2 className="text-lg font-semibold text-slate-900">Users</h2>
            {users.length > 0 ? (
              <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setSelectedEntryId(user.history?.[0]?.id ?? null);
                    }}
                    className={`w-full rounded-xl border bg-white/60 p-4 text-left text-sm shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                      user.id === selectedUserId
                        ? "border-rose-300 ring-2 ring-rose-200"
                        : "border-white/30"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest text-rose-500">
                      {user.role}
                    </p>
                    <p className="mt-2 font-medium text-slate-900">
                      {user.email}
                    </p>
                    <p className="mt-1 text-slate-600">
                      Diagnoses: {user.total_diagnoses}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                No users found.
              </p>
            )}
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-900">
                User Details
              </h2>
              {selectedUser ? (
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p>
                    <span className="font-medium text-slate-900">Email:</span>{" "}
                    {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Role:</span>{" "}
                    {selectedUser.role}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">
                      Latest diagnosis:
                    </span>{" "}
                    {selectedUser.latest_diagnosis_at
                      ? new Date(selectedUser.latest_diagnosis_at).toLocaleString()
                      : "No records"}
                  </p>
                  <div>
                    <button
                      type="button"
                      className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition duration-200 hover:border-rose-300 hover:bg-rose-50"
                      onClick={() => handleDeleteUser(selectedUser)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete User"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition duration-200 hover:border-rose-300 hover:bg-rose-100"
                      onClick={handleDownloadSelected}
                      disabled={isDownloading}
                    >
                      {isDownloading
                        ? "Preparing..."
                        : "Download Selected Report"}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
                      onClick={handleDownloadAll}
                      disabled={isDownloading}
                    >
                      Download Full History
                    </button>
                    {downloadError ? (
                      <span className="text-sm text-rose-600">
                        {downloadError}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a user to view details.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-900">
                User Diagnosis History
              </h2>
              {selectedHistory.length > 0 ? (
                <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-2">
                  {selectedHistory.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setSelectedEntryId(entry.id)}
                      className={`w-full rounded-xl border bg-white/60 p-4 text-left text-sm shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                        entry.id === selectedEntryId
                          ? "border-rose-300 ring-2 ring-rose-200"
                          : "border-white/30"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-widest text-rose-500">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                      <p className="mt-1 text-slate-700">
                        Top prediction: {entry.top_prediction}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  No diagnosis history for this user.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-900">
                Selected Diagnosis Details
              </h2>
              {selectedEntry ? (
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p className="text-xs uppercase tracking-widest text-rose-500">
                    {new Date(selectedEntry.created_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">
                      Top prediction:
                    </span>{" "}
                    {selectedEntry.top_prediction}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Symptoms:</span>{" "}
                    {selectedEntry.symptoms.join(", ")}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a diagnosis entry to view details.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-semibold text-slate-900">
                Prediction Confidence Chart
              </h2>
              {predictions.length > 0 ? (
                <div className="mt-4 h-64 rounded-lg border border-rose-100 bg-rose-50/40 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictions} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="disease" tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Probability"]}
                      />
                      <Bar dataKey="probability" fill="#e11d48" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a diagnosis entry to view prediction confidence.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminPanel;
