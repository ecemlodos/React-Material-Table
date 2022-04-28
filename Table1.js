import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowDimensions;
}



function Table1() {
  const { height, width } = useWindowDimensions();
  const [hideColumns, setHideColumns] = useState(false);
  useEffect(() => {
    if (width <= 1500) {
      setHideColumns(true);
    } else {
      setHideColumns(false);
    }
  }, [width]);

  const [hideColumn, setHideColumn] = useState(false);
  useEffect(() => {
    if (width <= 800) {
      setHideColumn(true);
    } else {
      setHideColumn(false);
    }
  }, [width]);

  const [tableData, setTableData] = useState([])
  
  const columns = [
    { title: "Cihaz No", field: "id", defaultSort: "asc", grouping: false, },
    { title: "Durumu", field: "adi" },
    { title: "Türü", field: "soyadi", lookup: { "Bilgisayar": "Bilgisayar", "Monitor": "Monitor" }, filterPlaceholder: "hepsi" },
    { title: "Markası", field: "marka", lookup: { "Apple": "Apple", "Dell": "Dell" }, filterPlaceholder: "hepsi" },
    { title: "Modeli", field: "model", hidden:hideColumn },
    { title: "Seri No", field: "serino", hidden:hideColumns },
    { title: "Adresi", field: "adres", hidden:hideColumns },
    { title: "Değeri TL", field: "değer", emptyValue: () => <em>0</em>, hidden:hideColumns },
    { title: "Açıklamalar", field: "açıklama", hidden:hideColumns },
    { title: "Zimmet Bilgisi", field: "zimmet", defaultSort: "asc", filterPlaceholder: "hepsi" },
    {
      title: "Teslim Edildi", field: "ver", type: "date", dateSetting: {
        format: 'dd/MM/yyyy'
      }, hidden:hideColumns
    },
    {
      title: "Teslim Alınacak", field: "al", type: "date", dateSetting: {
        format: 'dd/MM/yyyy'
      }, hidden:hideColumns
    },



  ]

  useEffect(()=>{
    fetch('http://192.168.1.113:8090/api/kisi/getAll')
    .then(resp=>resp.json())
    .then(resp=>setTableData(resp))
  },[])

  return (
    <div className="d-flex justify-content-center mt-5">
      <table className='Table1'>
        <tr>
          <th>
            <MaterialTable columns={columns} data={tableData}
              editable={{
                onRowAdd: (newRow) => new Promise((resolve, reject) => {
                  setTableData([...tableData, newRow])
                  resolve()
                }),
                onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
                  const updatedData = [...tableData]
                  updatedData[oldRow.tableData.id] = newRow
                  setTableData(updatedData)
                  resolve()
                }),
                onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
                  const updatedData = [...tableData]
                  updatedData.splice(selectedRow.tableData.id, 1)
                  setTableData(updatedData)
                }),
              }}

              options={{
                tableLayout: "auto",
                sorting: true,
                searchFieldVariant: "outlined",
                filtering: true,
                exportButton: true, exportAllData: true, exportFileName: "Sistem Kullanıcıları",
                paging: true, pageSizeOptions: [5, 10, 20, /*{ value: data.length, label: 'All' }*/],
                addRowPosition: "first", actionsColumnIndex: -1,
                grouping: true, columnsButton: true,
                rowStyle: (data, index) => index % 2 == 0 ? { background: "#f5f5f5" } : null
              }}
              title="Cihazlar" />
          </th></tr> </table>
    </div>
  )
}

export default Table1;

