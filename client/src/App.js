import './App.scss';
import Card from './components/Card/Card';
import Calendar from './components/Calendar/Calendar';
import Bar from './components/Bar/Bar';
import Bump from './components/Bump/Bump';
import Choropleth from './components/Choropleth/Choropleth';
import ScrollableContainer from 'react-full-page-scroll';

const PageComponent = ({children}) => {
  return (<div>{children}</div>)
}

function App() {
  return (
    <div className="App">
      <ScrollableContainer animationTime={1500}>
        <PageComponent><Card /></PageComponent>
        <PageComponent><Calendar /></PageComponent>
        <PageComponent><Bar /></PageComponent>
        <PageComponent><Bump /></PageComponent>
        <PageComponent><Choropleth /></PageComponent>
      </ScrollableContainer>
    </div>
  );
}

export default App;