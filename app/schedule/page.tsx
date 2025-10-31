'use client';

import { SchedulePage } from '../components/pages/SchedulePage';
import { PageLayout } from '../components/PageLayout';

export default function Schedule() {
  return (
    <PageLayout>
      <SchedulePage onNavigate={() => {}} />
    </PageLayout>
  );
}