import React, { useEffect, useState } from 'react'
import "./FeaturedInfo.css";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { axiosInstance } from '../../axiosInstance';

const FeaturedInfo: React.FC = () => {
  
  const [income, setIncome] = useState<any>([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const res = await axiosInstance.get("/api/orders/income");
        setIncome(res.data);
        setPercentage(res.data.length > 1 ? (res.data[1].total * 100) / res.data[0].total - 100 : 0);
      } catch (error) {
        console.log(error.message)
      }
    };
    getIncome();
  }, []);

const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const thisMonth = monthArray[new Date().getMonth()]

  return (
      <div className="featuredInfo">
        <h4>{thisMonth.toUpperCase()}</h4>
        <div className="featuredMoneyContainer">
          <span className="featuredTitle">Revenue</span>
          <span className="featuredMoney">${income?.length > 1 ? income[1]?.total : income[0]?.total}</span>
          <span className="featuredMoneyRate">
            {percentage < 0 ? (
              <ArrowDownwardIcon className="featuredIcon negative" />
            ) : (
              <ArrowUpwardIcon className="featuredIcon" />
            )}
          </span>
        </div>
      </div>
  );
}

export default FeaturedInfo