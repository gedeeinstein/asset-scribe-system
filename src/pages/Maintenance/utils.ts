
import { assets, users } from "../../data/mockData";
import { Maintenance } from "../../types/models";

export const getAssetName = (assetId: string) => {
  const asset = assets.find(a => a.id === assetId);
  return asset ? `${asset.name} (${asset.assetTag})` : 'Unknown Asset';
};

export const getUserName = (userId?: string) => {
  if (!userId) return 'Unassigned';
  return users.find(user => user.id === userId)?.name || 'Unknown User';
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};
