import Aurora from "./hero.jsx";
import HeroSection from "./components/HeroSection.jsx";
import Features from "./components/features.jsx";
import Masonry from "./components/masonary";
import Footer from "./components/footer";

const items = [
  {
    id: 1,
    img: "https://cdn.dribbble.com/userupload/44493558/file/222e130b5711110c712b618b71e06f8e.jpg?resize=2048x1365&vertical=center",
    height: 800,
    url: "#",
  },
  {
    id: 10,
    img: "https://cdn.dribbble.com/userupload/46779252/file/d51152d7f44fac1611f551d495ca3e68.png?resize=2048x1536&vertical=center",
    height: 800,
    url: "#",
  },

  {
    id: 2,
    img: "https://cdn.dribbble.com/userupload/46621314/file/0f08268068817fcfd4c3610ffdf726ab.png?resize=1024x1024&vertical=center",
    height: 800,
    url: "#",
  },

  {
    id: 12,
    img: "https://cdn.dribbble.com/userupload/45349571/file/bdfa139f276ae8fea7242d2d7260349e.webp?resize=1200x636&vertical=center",
    height: 800,
    url: "#",
  },
  {
    id: 4,
    img: "https://cdn.dribbble.com/userupload/16481989/file/original-453cfb7e8214bd2bb2f6bb426f6cde3d.png?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },

  {
    id: 6,
    img: "https://cdn.dribbble.com/userupload/44462202/file/b564a66c232eeca261e8c7368c776373.png?resize=1024x776&vertical=center",
    height: 700,
    url: "#",
  },
  {
    id: 7,
    img: "https://cdn.dribbble.com/userupload/29127079/file/original-a9dc166ffd94de259df67c117c856821.png?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },
  {
    id: 8,
    img: "https://cdn.dribbble.com/userupload/24886939/file/original-625f73e5175f59373367b7248246e473.jpg?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },
  {
    id: 3,
    img: "https://cdn.dribbble.com/userupload/40321183/file/original-9d8d5f18fbbe04388be34aa0a04a6ae6.png?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },
  {
    id: 9,
    img: "https://cdn.dribbble.com/userupload/37300610/file/original-43475f9d86d03553f4a87eb4af43c096.jpg?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },

  {
    id: 11,
    img: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/5bf3bf156337333.63651adc6a74f.jpg",
    height: 800,
    url: "#",
  },
  {
    id: 5,
    img: "https://cdn.dribbble.com/userupload/24288238/file/original-a98b79c51cf90c9b45d51da8e902d742.png?resize=1504x1128&vertical=center",
    height: 800,
    url: "#",
  },
];

export default function Home() {
  return (
    <>
      <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
        <Aurora
          colorStops={["#00C9FF", "#92FE9D", "#00C9FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
        <HeroSection />
      </div>
      <Features />
      <section
        id="gallery"
        style={{
          width: "100%",
          backgroundColor: "#121212",
          padding: "80px 20px",
          minHeight: "100vh",
        }}
      >
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.95}
          blurToFocus
          colorShiftOnHover={false}
        />
      </section>
      <Footer />
    </>
  );
}
