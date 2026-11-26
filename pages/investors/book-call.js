export async function getServerSideProps() {
  return { redirect: { destination: "/investors/schedule-call", permanent: false } };
}

export default function BookInvestorCall() {
  return null;
}
