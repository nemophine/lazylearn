'use client';

import { CategoryOverviewPage } from '../components/pages/CategoryOverviewPage';
import { PageLayout } from '../components/PageLayout';

export default function Courses() {
  return (
    <PageLayout>
      <CategoryOverviewPage onNavigate={() => {}} />
    </PageLayout>
  );
}