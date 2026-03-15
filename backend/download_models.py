import os
import re
import urllib.request
from urllib.parse import urlparse

FILES = {
    "disease_model.pt": "https://drive.google.com/file/d/1SdYQeYOv5ksmjqFmvC0qzp2GQSfnu7ce/view?usp=sharing",
    "symptom_embeddings.npy": "https://drive.google.com/file/d/1XpDDqiSsfbgpqn0kpzDldewR--I_Qkgl/view?usp=sharing",
    "symptom_names.npy": "https://drive.google.com/file/d/1NFn-_tJLxGn8NTyx_ig-iDuAFTZTbbS_/view?usp=sharing",
    "X.npy": "https://drive.google.com/file/d/1nECpXZKosWNiTF55NUAnQDSDBM9BHiKV/view?usp=sharing",
    "y.npy": "https://drive.google.com/file/d/1ZWCsYq5E-X8nKAu5erW4MsTe-0hUFlWp/view?usp=sharing",
}


def _extract_gdrive_id(url):
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if match:
        return match.group(1)
    parsed = urlparse(url)
    if parsed.netloc.endswith("drive.google.com"):
        query = dict(qc.split("=") for qc in parsed.query.split("&") if "=" in qc)
        return query.get("id")
    return None


def _normalize_url(url):
    if "drive.google.com" in url:
        file_id = _extract_gdrive_id(url)
        if file_id:
            return f"https://drive.google.com/uc?export=download&id={file_id}"
    return url


def _download_file(url, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    urllib.request.urlretrieve(url, path)


def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(backend_dir, ".."))

    model_path = os.getenv("MODEL_PATH", os.path.join(repo_root, "ai-model", "disease_model.pt"))
    model_dir = os.path.dirname(os.path.abspath(model_path))
    cache_dir = os.getenv("DATA_CACHE_DIR", backend_dir)

    targets = {
        "disease_model.pt": os.path.join(model_dir, "disease_model.pt"),
        "symptom_embeddings.npy": os.path.join(model_dir, "symptom_embeddings.npy"),
        "symptom_names.npy": os.path.join(cache_dir, "symptom_names.npy"),
        "X.npy": os.path.join(cache_dir, "X.npy"),
        "y.npy": os.path.join(cache_dir, "y.npy"),
    }

    for filename, url in FILES.items():
        path = targets[filename]
        if os.path.exists(path):
            print(f"Skipping {filename}, already present.")
            continue
        download_url = _normalize_url(url)
        print(f"Downloading {filename}...")
        _download_file(download_url, path)

    print("All model files downloaded.")


if __name__ == "__main__":
    main()
