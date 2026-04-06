'use client';

import { useState } from 'react';
import FilterDrawer from './FilterDrawer';
import FilterToggle from './FilterToggle';
import { ProductsData } from '@/types/strapiApiResponses';

interface FilterMobileProps {
  products: ProductsData[] | null;
}

export default function FilterMobile({ products }: FilterMobileProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <FilterToggle onClick={() => setDrawerOpen(true)} />
      {drawerOpen && (
        <FilterDrawer products={products} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
