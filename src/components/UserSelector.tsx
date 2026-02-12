'use client';

import { useEffect, useState } from 'react';
import type { IUser } from '@/lib/types';

interface UserSelectorProps {
  onSelect: (user: IUser) => void;
  selectedUserId?: string;
}

export default function UserSelector({ onSelect, selectedUserId }: UserSelectorProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        if (json.success && json.data) {
          setUsers(json.data);
          const stored = localStorage.getItem('meritmind_userId');
          const defaultUser =
            json.data.find((u: IUser) => u._id === stored) || json.data[0];
          if (defaultUser && !selectedUserId) {
            onSelect(defaultUser);
          }
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (user: IUser) => {
    localStorage.setItem('meritmind_userId', user._id);
    onSelect(user);
  };

  if (loading) {
    return (
      <div className="flex gap-3" role="status" aria-label="Loading residents">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-20 h-[4.5rem] rounded-2xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-center" role="alert">
        <p className="text-sm text-amber-700 mb-3">
          No residents found. Seed the demo data first.
        </p>
        <button
          onClick={async () => {
            await fetch('/api/seed', { method: 'POST' });
            window.location.reload();
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200/50 active:scale-95 focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Seed Demo Data
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Select a resident">
      {users.map((user) => {
        const isSelected = selectedUserId === user._id;
        return (
          <button
            key={user._id}
            onClick={() => handleSelect(user)}
            role="radio"
            aria-checked={isSelected}
            className={`relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500 ${
              isSelected
                ? 'border-teal-500 bg-gradient-to-b from-teal-50 to-white shadow-md shadow-teal-100/50 scale-105'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-md hover:scale-[1.03]'
            }`}
          >
            {/* Selected indicator dot */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow-sm" aria-hidden="true" />
            )}
            <span className="text-2xl md:text-3xl" aria-hidden="true">{user.avatar}</span>
            <span
              className={`text-xs md:text-sm font-semibold truncate w-full text-center ${
                isSelected ? 'text-teal-700' : 'text-stone-600'
              }`}
            >
              {user.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
