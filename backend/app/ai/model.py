import torch
import torch.nn as nn


class DiseasePredictor(nn.Module):
	def __init__(self, input_size, num_classes):
		super().__init__()

		self.network = nn.Sequential(
			nn.Linear(input_size, 1024),
			nn.BatchNorm1d(1024),
			nn.ReLU(),
			nn.Dropout(0.5),
			nn.Linear(1024, 512),
			nn.BatchNorm1d(512),
			nn.ReLU(),
			nn.Dropout(0.4),
			nn.Linear(512, 256),
			nn.ReLU(),
			nn.Linear(256, num_classes),
		)

	def forward(self, x):
		return self.network(x)
