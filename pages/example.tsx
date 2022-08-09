import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps({ locale }: any) {
  console.log(locale);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["example"])),
      // Will be passed to the page component as props
    },
  };
}
const Example: NextPage = () => {
  const { t } = useTranslation("example");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>{t("e1")}</h1>
        <h1>{t("e2")}</h1>
        <h1>{t("e3")}</h1>
        <h1>{t("e4")}</h1>
      </div>
    </div>
  );
};

export default Example;
