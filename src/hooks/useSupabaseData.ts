
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('it_assets_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('it_assets_divisions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useComponents = () => {
  return useQuery({
    queryKey: ['components'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('it_assets_components')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('it_assets_assets')
        .select(`
          *,
          components:it_assets_asset_components(
            component:it_assets_components(*)
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
};
