import NewsList from './components/NewsList';
import ClientAnalyzeBox from '../components/ClientAnalyzeBox';

export default async function NewsPage() {
  return (
    <>
      <NewsList />
      <ClientAnalyzeBox />
    </>
  );
}