
import React,{useState,useEffect} from 'react';



function useCurrencyInfo(currency){

    const [data, setData] = useState({});
    const url=` https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/${currency}.json`;

    useEffect(()=>{
        fetch(url)
        .then((res)=> res.json())
        .then((jsObj)=> setData(jsObj[currency]))
    },[currency])

    console.log(data);
    return data;

}


export default useCurrencyInfo;