import { AdminDashboardForm } from "@/components/admin/admin-dashboard-form";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    editRollNo?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const editRollNoFromQueryParameter = resolvedSearchParams?.editRollNo ?? "";

  return (
    <AdminDashboardForm
      editRollNoFromQueryParameter={editRollNoFromQueryParameter}
    />
  );
}
