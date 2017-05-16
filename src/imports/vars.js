window.lineChartOptions = {
  chart: {
    height: 130,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    spacingTop: 0,
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
  },
  title: false,
  yAxis: {
    title: false,
    visible: false,
  },
  legend: false,
  credits: false,
  loading: true,
  exporting: {
    enabled: false
  },
  xAxis: {
    categories: [],
    tickLength: 10,
    labels: {
      style: {
        color: '#999',
        cursor: 'default',
        fontSize: '11px',
      }
    }
  },
  plotOptions: {
    line: {
      size:'100%',
      color: '#6D5CAE',
      dataLabels: {
        enabled: true,
        y: -1,
        inside: true,
        style: {
          color: '#666',
          fontSize: '11px',
          fontWeight: 'normal',
          textOutline: 'none',
          cursor: 'default',
        },
      },
      enableMouseTracking: false
    }
  },
}

window.pieChartOptions = {
  chart: {
    type: 'pie',
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    // marginRight: 0,
    spacingTop: 0,
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
  },
  title: false,
  legend: {
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical',
    itemMarginBottom: 5,
    symbolRadius: 3,
    itemStyle: {
      color: '#999',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'normal',
    },
  },
  credits: false,
  loading: true,
  exporting: {
    enabled: false
  },
  plotOptions: {
    pie: {
      size:'100%',
      slicedOffset: 0,
      enableMouseTracking: false,
      dataLabels: {
        distance: -20,
        inside: true,
        format: '{y}%',
        style: {
          color: '#FFF',
          fontSize: '12px',
          fontWeight: 'bold',
          textOutline: 'none',
          cursor: 'default',
        },
      },
      showInLegend: true
    }
  },
}
