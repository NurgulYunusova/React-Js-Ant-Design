import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios.get("https://northwind.vercel.app/api/orders").then((res) => {
      setOrders(res.data);
      setLoading(false);
      updateFiltereData(res.data);
    });
  };

  const updateFiltereData = (data) => {
    const uniqueIds = [...new Set(data.map((order) => order.customerId))];

    const filterOptions = uniqueIds.map((id) => ({
      text: id,
      value: id,
    }));

    setFilters(filterOptions);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const daySuffix = getDaySuffix(day);
    const year = date.getFullYear() % 100;

    return `${month} ${day}${daySuffix} ${year}`;
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const rowClassName = (record) => {
    if (record.requiredDate < record.shippedDate) {
      return "red-row";
    }

    return "";
  };

  let columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Id",
      dataIndex: "customerId",
      key: "customerId",
      filters,
      onFilter: (value, record) => record.customerId === value,
    },
    {
      title: "Freight",
      dataIndex: "freight",
      key: "freight",
      sorter: (a, b) => a.freight - b.freight,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "shipAddress.city",
      render: (text, record) => <span>{record.shipAddress?.city}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "shipAddress.country",
      render: (text, record) => <span>{record.shipAddress?.country}</span>,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => formatDate(text),
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: "Required Date",
      dataIndex: "requiredDate",
      key: "requiredDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Shipped Date",
      dataIndex: "shippedDate",
      key: "shippedDate",
      render: (text) => formatDate(text),
    },
  ];

  return (
    <>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        rowClassName={rowClassName}
      />
    </>
  );
}

export default Orders;
