export async function getServerSideProps() {
  return { redirect: { destination: "/submit-deal", permanent: false } };
}

export default function ApplyNow() {
  return null;
}
