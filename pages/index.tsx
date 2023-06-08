import { GetServerSideProps } from "next";

const Home = () => null;

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: "/random_name_app/features",
    },
  };
};
