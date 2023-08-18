import { GetStaticProps } from "next";
import Link from "next/link";
import ArticleCard from "../components/ArticleCard";
import Layout from "../components/Layout";
import { MenuItem, pagesToMenuItems } from "../components/Navigation";
import { BlogPost, getBlogPosts, getPage, getPages, Page } from "../utils/api";
import { formatDate } from "../utils/date";

interface Props {
  preview: boolean;
  homePage: Page;
  blogPosts: BlogPost[];
  menuItems: MenuItem[];
}

export default function HomePage({
  preview,
  homePage,
  blogPosts,
  menuItems,
}: Props) {
  const heroPost = blogPosts.length > 0 ? blogPosts[0] : undefined;
  const morePosts = blogPosts.slice(1);

  return (
    <Layout
      preview={preview}
      menuItems={menuItems}
      heroImage={homePage.heroImage}
      headerContent={
        <div className="shadow-md header-title">
          <h1>Hallakedon kennel</h1>
          <h2>Suomenlapinkoirien pienimuotoista kasvatusta Oulussa</h2>
          <p className="hidden md:block">
            Hallakedon kennel on pieni kotikenneli, johon pentuja syntyy
            harvakseltaan ja vain harkituista yhdistelmistä. Tavoitteenamme on
            kasvattaa terveitä, hyväluonteisia ja harrastuksiin sopivia
            aktiivisia suomenlapinkoiria.
          </p>
        </div>
      }
      mainContent={
        <div>
          <span className="mb-6">
            <b>Etusivu</b>
          </span>
          <h3 className="pt-4 mb-4">
            Tervetuloa Hallakedon kennelin kotisivuille!
          </h3>
          <p className="pb-6 mb-6 border-b-2 border-black">
            Olen Anna Tiala (omaa sukua Runtti) ja kasvatan pienimuotoisesti
            suomenlapinkoiria Oulussa. Aloitin kasvatustyöni vuonna 2014,
            jolloin syntyi kennelini ensimmäinen pentue yhdistelmästä
            Kultalangan Wenus ja Fihtolas Ekoteko. Toinen pentue syntyi
            elokuussa 2016 yhdistelmästä Kultalangan Wenus ja Kuuhvitar Gielas.
            Kolmas pentue on syntyi koiralleni Hallakedon Lumimarjalle
            helmikuussa 2018. Tämän jälkeen meille on syntynyt vielä kaksi
            pentuetta ja kuudes pentue on suunnitteilla mahdollisesti keväälle
            2024. Asumme mieheni, kahden lapsemme ja koiriemme kanssa Oulun
            Jäälissä omakotitalossa ja koirat elävät sisällä talossa ihmisten
            kanssa lemmikkeinä arkemme keskellä. Tavoitteeni on kasvattaa
            terveitä, hyväluonteisia ja kauniita, harrastuksiin soveltuvia
            suomenlapinkoiria. Tulevista pentusuunnitelmistamme voit lukea
            Pentuja-sivulta.
          </p>
          <h3 className="mb-6">Käy lukemassa uusin blogipostaus:</h3>
          {heroPost && <ArticleCard blogPost={heroPost} />}
        </div>
      }
      asideContent={
        <div>
          <h3 className="pb-4 mb-4 border-b-2 border-black">
            Viimeisimmät artikkelit
          </h3>
          <ul className="pb-4 mb-4">
            {heroPost && (
              <li className="article-link-list">
                <Link href={`/blogi/${heroPost.slug}`}>
                  <span>{heroPost.title}</span>
                  <br />
                  <span className="post-date">{formatDate(heroPost.date)}</span>
                </Link>
              </li>
            )}
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li key={index} className="article-link-list">
                  <Link href={`/blogi/${post.slug}`}>
                    <span>{post.title}</span>
                    <br />
                    <span className="post-date">{formatDate(post.date)}</span>
                  </Link>
                </li>
              ))}
          </ul>
          <h3 className="pb-4 mb-4 border-b-2 border-black">Linkkejä</h3>
          <ul>
            <li className="article-link-list">
              <Link href="https://www.lappalaiskoirat.fi/">
                Lappalaiskoirat ry
              </Link>
            </li>
            <li className="article-link-list">
              <Link href="https://www.lappalaiskoirat.fi/puhdas-lappalaiskoira/">
                Puhdas lappalaiskoira -kampanja
              </Link>
            </li>
            <li className="article-link-list">
              <Link href="http://terveys.lappalaiskoiragalleria.org/">
                Lappalaiskoiratietokanta
              </Link>
            </li>
            <li className="article-link-list">
              <Link href="https://jalostus.kennelliitto.fi/">
                Jalostustietojärjestelmä
              </Link>
            </li>
            <li className="article-link-list">
              <Link href="https://www.kennelliitto.fi/">Kennelliitto</Link>
            </li>
            <li className="article-link-list">
              <Link href="https://www.hankikoira.fi/">Hankikoira.fi</Link>
            </li>
          </ul>
        </div>
      }
      footerContent={
        <div>
          <b>
            <span className="mb-4">Hallakedon kennel</span>
          </b>
          <br />
          <span>Anna Tiala</span>
          <br />
          <span>Aarnonkuja 25, 90940 Jääli</span>
          <br />
          <span>anruntti@gmail.com</span>
        </div>
      }
    />
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
  preview = false,
}) => {
  const homePage = await getPage("etusivu", preview);
  const blogPosts = await getBlogPosts(4, preview);
  const pages = await getPages(preview);
  const menuItems = pagesToMenuItems(pages);

  return {
    props: { preview, homePage, blogPosts, menuItems },
  };
};
