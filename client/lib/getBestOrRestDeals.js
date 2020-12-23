const getBestOrRestDeals = (hotels, param) => {
  const hotel = hotels[0];
  const prices = hotel.prices;
  prices.sort((a, b)=>{ return a.price === b.price ? 0 : a.price < b.price ? -1 : 1; });
  const temp = prices.reduce((memo, item)=>{
    if (item.price !== 0) memo.push(item);
    return memo;
  }, []);
  if (param === 'getBest') return temp.slice(0, 2);
  if (param === 'getRest') return temp.slice(2);
};

export default getBestOrRestDeals;