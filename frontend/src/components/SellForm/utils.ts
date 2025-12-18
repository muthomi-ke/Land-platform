import { supabase } from '../../lib/supabaseClient';

export const uploadFiles = async (files: File[], bucket: string = 'plots-media'): Promise<string[]> => {
  const urls: string[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop() ?? 'jpg';
    const filePath = `${bucket}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    if (publicData?.publicUrl) {
      urls.push(publicData.publicUrl);
    }
  }
  
  return urls;
};

export const formatPrice = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  // Add commas as thousand separators
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parsePrice = (formattedValue: string): number => {
  return parseInt(formattedValue.replace(/\D/g, ''), 10) || 0;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation (10-15 digits, may start with +)
  return /^[+]?[0-9\s-]{10,15}$/.test(phone);
};
