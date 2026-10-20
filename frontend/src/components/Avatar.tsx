'use client';

import React, { useState } from 'react';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  gender?: 'female' | 'male' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  showGenderBadge?: boolean;
}

export default function Avatar({
  src,
  name = 'User',
  gender,
  size = 'md',
  className = '',
  alt,
  showGenderBadge = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Determine effective gender
  const lowerName = (name || '').toLowerCase();
  const detectedGender: 'female' | 'male' =
    gender === 'female' || gender === 'male'
      ? gender
      : lowerName.includes('ummelaila') ||
        lowerName.includes('fatima') ||
        lowerName.includes('ayesha') ||
        lowerName.includes('zainab') ||
        lowerName.includes('maryam') ||
        lowerName.includes('hina') ||
        lowerName.includes('sana')
      ? 'female'
      : lowerName.includes('usman') ||
        lowerName.includes('bilal') ||
        lowerName.includes('hamza') ||
        lowerName.includes('omer') ||
        lowerName.includes('kamran')
      ? 'male'
      : 'female';

  // Extract up to 2 uppercase initials
  const cleanName = (name || '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = '';
  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    initials = parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  } else {
    initials = 'HR';
  }

  // Size styling map
  const sizeMap = {
    xs: {
      wrapper: 'w-6 h-6 text-[10px]',
      indicator: 'w-1.5 h-1.5',
    },
    sm: {
      wrapper: 'w-9 h-9 text-xs',
      indicator: 'w-2 h-2',
    },
    md: {
      wrapper: 'w-10 h-10 text-xs font-bold',
      indicator: 'w-2.5 h-2.5',
    },
    lg: {
      wrapper: 'w-11 h-11 text-sm font-bold',
      indicator: 'w-2.5 h-2.5',
    },
    xl: {
      wrapper: 'w-16 h-16 text-xl font-extrabold',
      indicator: 'w-3.5 h-3.5',
    },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;
  const isFemale = detectedGender === 'female';

  // If valid src and not errored
  if (src && src.trim() !== '' && !imageError) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setImageError(true)}
        className={`${selectedSize.wrapper} rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 ${className}`}
      />
    );
  }

  // No profile picture - render professional gender-themed placeholder
  const gradientClass = isFemale
    ? 'bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 text-white shadow-sm ring-1 ring-rose-300/40 dark:ring-rose-800/40'
    : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white shadow-sm ring-1 ring-blue-300/40 dark:ring-blue-800/40';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none ${selectedSize.wrapper} ${gradientClass} ${className}`}
      title={`${name} (${isFemale ? 'Female' : 'Male'} Employee)`}
      aria-label={`${name} (${isFemale ? 'Female' : 'Male'})`}
    >
      <span className="tracking-tight leading-none font-bold">{initials}</span>

      {showGenderBadge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${selectedSize.indicator} rounded-full ring-2 ring-white dark:ring-slate-900 ${
            isFemale ? 'bg-pink-500' : 'bg-blue-500'
          }`}
          title={isFemale ? 'Female' : 'Male'}
        />
      )}
    </div>
  );
}
