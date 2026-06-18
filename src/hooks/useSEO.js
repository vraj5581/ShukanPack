import { useEffect } from "react";

function useSEO({ title, description, keywords, noindex }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Handle Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (description) {
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        metaDesc.content = description;
        document.head.appendChild(metaDesc);
      }
    } else if (metaDesc) {
      metaDesc.setAttribute("content", "Shukan Packaging - Premium custom packaging solutions based in Morbi, Gujarat.");
    }

    // Handle Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        metaKeywords.content = keywords;
        document.head.appendChild(metaKeywords);
      }
    }

    // Handle Robots (noindex/nofollow)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (metaRobots) {
        metaRobots.setAttribute("content", "noindex, nofollow");
      } else {
        metaRobots = document.createElement("meta");
        metaRobots.name = "robots";
        metaRobots.content = "noindex, nofollow";
        document.head.appendChild(metaRobots);
      }
    } else {
      if (metaRobots) {
        metaRobots.setAttribute("content", "index, follow");
      } else {
        metaRobots = document.createElement("meta");
        metaRobots.name = "robots";
        metaRobots.content = "index, follow";
        document.head.appendChild(metaRobots);
      }
    }
  }, [title, description, keywords, noindex]);
}

export default useSEO;
