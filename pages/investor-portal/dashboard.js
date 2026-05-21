export async function getServerSideProps() {
  return { redirect: { destination: "/investor/dashboard", permanent: false } };
}

export default function LegacyPortalDashboard() {
  return null;
}
