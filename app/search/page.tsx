'use client';

import { SearchPage } from '../components/pages/SearchPage';
import { PageLayout } from '../components/PageLayout';

export default function Search() {
  return (
    <PageLayout>
      <SearchPage initialQuery="" onNavigate={() => {}} />
    </PageLayout>
  );
}