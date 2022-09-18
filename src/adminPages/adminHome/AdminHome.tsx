import React, {useEffect, useMemo, useState} from 'react'
import Chart from "../../adminComponents/chart/Chart";
import FeaturedInfo from "../../adminComponents/featuredInfo/FeaturedInfo";
import "./AdminHome.css";
import Members from "../../adminComponents/members/Members";
import Transactions from "../../adminComponents/transactions/Transactions";
import { axiosInstance } from '../../axiosInstance';
import Sidebar from '../../adminComponents/sidebar/Sidebar';


export interface UserStatsType {
  _id: String,
  total: Number
}

const AdminHome : React.FC = () => {

    const [userStats, setUserStats] = useState<UserStatsType[]>([]);

const MONTHS = useMemo(
    () => [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    ],[]
);


  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axiosInstance.get("/api/users/stats");
        Array.isArray(res.data) && res.data.map((item: any) =>
          setUserStats((prev: any) => [
            ...prev, { name: MONTHS[item._id - 1], "Active User": item.total },
          ])
        );
      } 
      catch (error){
        console.log(error)
      }
    };
    getStats();
  }, [MONTHS]);


return (
<div className="admin-home">
  <Sidebar/>
  <div className="admin-home-container">
    <div className='admin-homeSales'>
      <FeaturedInfo />
      <Chart
        data={userStats}
        grid
        dataKey="Active User"
      />
    </div>
    <div className="admin-homeWidgets">
        <Members />
        <Transactions />
    </div>
  </div>
</div>
)}

export default  AdminHome