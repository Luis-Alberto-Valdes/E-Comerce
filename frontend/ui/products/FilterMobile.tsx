'use client';

import { useState } from 'react';
import FilterDrawer from './FilterDrawer';
import FilterToggle from './FilterToggle';
import styles from './FilterMobile.module.css';

export default function FilterMobile() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <FilterToggle onClick={() => setDrawerOpen(true)} />
      {drawerOpen && (
        <FilterDrawer onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
