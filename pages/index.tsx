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
          <span>
            <b>Etusivu</b>
          </span>
          <br />
          <br />
          <h3>Tervetuloa Hallakedon kennelin kotisivuille!</h3>
          <br />
          <p className="pb-6 mb-6 border-b-2 border-black">
            Olen Anna Tiala (entiseltä sukunimeltäni Runtti) ja kasvatan
            pienimuotoisesti suomenlapinkoiria Oulussa. Aloitin kasvatustyöni
            vuonna 2014, jolloin syntyi kennelini ensimmäinen pentue
            yhdistelmästä Kultalangan Wenus ja Fihtolas Ekoteko. Toinen pentue
            syntyi elokuussa 2016 yhdistelmästä Kultalangan Wenus ja Kuuhvitar
            Gielas. Kolmas pentue on syntyi koiralleni Hallakedon Lumimarjalle
            helmikuussa 2018. Tämän jälkeen meille on syntynyt vielä kaksi
            pentuetta ja kuudes pentue on suunnitteilla mahdollisesti keväälle
            2024. Asumme mieheni, kahden lapsemme ja koiriemme kanssa Oulun
            Jäälissä omakotitalossa ja koirat elävät sisällä talossa ihmisten
            kanssa lemmikkeinä arkemme keskellä. Tavoitteeni on kasvattaa
            terveitä, hyväluonteisia ja kauniita, harrastuksiin soveltuvia
            suomenlapinkoiria. Juuri nyt meillä ei ole aivan ajankohtaisia
            pentusuunnitelmia, mutta Pentuja-sivulta löydät lisätietoa
            tulevaisuuden pentusuunnitelmista.
          </p>
          <h3>Käy lukemassa uusin blogipostaus:</h3>
          <br />
          {heroPost && <ArticleCard blogPost={heroPost} />}
        </div>
      }
      asideContent={
        <div>
          <h3 className="pb-4 mb-4 border-b-2 border-black">
            Viimeisimmät artikkelit
          </h3>
          <ul>
            {morePosts.length > 0 &&
              morePosts.map((post, index) => (
                <li key={index}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      }
      footerContent={
        <div>
          <b>Hallakedon kennel</b>
          <br />
          Anna Tiala
          <br />
          Aarnonkuja 25, 90940 Jääli
          <br />
          anruntti@gmail.com
          <br />
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
