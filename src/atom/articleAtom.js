import { atom, selector, selectorFamily } from "recoil";
import { v1 } from "uuid";
import { getAllArticles, getArticle } from "../api/article";
import { cardDemoData } from "../components/card/ProductCardList";

export const articlesState = atom({
  key: `articlesState/${v1()}`,
  default: [],
  effects: [
    async ({ setSelf }) => {
      const articles = await getAllArticles();
      if (!articles) {
        setSelf(cardDemoData);
      } else {
        setSelf(articles.data);
      }
    },
  ],
});

// 검색창에 input 바뀔 때 이 state를 변경함
export const articlesFilterState = atom({
  key: `articlesFilterState/${v1()}`,
  default: "",
});

// selector가 filter state를 이용해 필터링된 결과를 반환
export const filteredArticlesSelector = selector({
  key: `filteredArticlesSelector/${v1()}`,
  get: ({ get }) => {
    const filter = get(articlesFilterState);
    const articles = get(articlesState);

    return articles.filter(({ title }) => title.includes(filter));
  },
});

export const selectedArticleSelector = selectorFamily({
  key: `selectedArticleSelector/${v1()}`,
  get:
    (articleId) =>
    async ({ get }) => {
      /**
       * @TODO
       * articlesAtom에 존재한다면 api를 호출하지 않습니다.
       */
      if (!articleId) {
        return;
      }
      const { data } = await getArticle(articleId.toString());
      if (!data) {
        return {};
      } else {
        return data.article;
      }
    },
});
