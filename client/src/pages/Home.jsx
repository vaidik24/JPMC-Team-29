import React from 'react';
import Exploremenu from '../components/Exploremenu';
import ItemDisplay from '../components/ItemDisplay';





export default function Home() {
  const[category,setCategory]=React.useState("All")
  return (
    <>
      <Exploremenu  className="flex justify-center" category={category} setCategory={setCategory}/>
      <ItemDisplay category={category}/>
    </>
  );
}
