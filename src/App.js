import React, { useEffect, useState } from 'react';
import './App.css';
import $ from 'jquery';
import axios from 'axios';

const App = () => {
  const[sku, setSku] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const links = [
    {link: 'noutbuklar.az', toggle: false, sku},
    {link: 'deltastore.az', toggle: false, sku},
    {link: 'icomp.az', toggle: false, sku},
    {link: 'compstore.az', toggle: false, sku},
    {link: 'notecomp.az', toggle: false, sku},
    {link: 'aztechshop.az', toggle: false, sku},
    {link: 'texnomart.az', toggle: false, sku},
    {link: 'amazoncomp.az', toggle: false, sku},
    {link: 'bakinity.biz', toggle: false, sku},
    {link: 'bermud.az', toggle: false, sku},
    {link: 'tap.az', toggle: false, sku},
    {link: 'umico.az', toggle: false, sku},
    {link: 'bakuelectronics.az', toggle: false, sku},
    {link: 'kontakt.az', toggle: false, sku}
  ]
  const[output, setOutput] = useState();
  const[statusInfo, setStatusInfo] = useState();

  const searchFunc = async () => {
    if(sku.length < 1) {
      alert('SKU kodunu daxil et')
    }
    else if (!links.some((item) => item.toggle === true)) {
      alert('Parsing olunan saytı seç');
    }
    else {
      $('.inpBtn:not(.upload-btn-wrapper) img').attr('src', 'https://media.tenor.com/JBgYqrobdxsAAAAi/loading.gif');
      $('.inpBtn input, button').attr('disabled', 'disabled');
      $('.links > div').off('click');
      axios.post('/search', {
        links
      })
      .then(response => {
        $('.inpBtn:not(.upload-btn-wrapper) img').attr('src', 'https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-21.png');
        $('.inpBtn input, button').removeAttr('disabled');
        $('.links > div').on('click');
        $('.links > div').css({border: '0px solid #000'});
        setOutput(response.data);

        /* setTimeout(() => {
          window.location.href = 'http://localhost:8888/download';
        }, 1000); */
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = () => {
    if(!selectedFile) {
      alert('Fayl tapılmadı')
    }
    else if (!links.some((item) => item.toggle === true)) {
      alert('Parsing olunan saytı seç');
    }
    else {
      setInterval(() => {
        axios.get('/status-info')
        .then(response => {
          setStatusInfo(response.data);
        })
        .catch(err => {
          console.log(err);
        });
      }, 1000);

      $('.upload-btn-wrapper button img').attr('src', 'https://media.tenor.com/JBgYqrobdxsAAAAi/loading.gif');
      $('.inpBtn input, button').attr('disabled', 'disabled');
    const formData = new FormData();
    formData.append('myfile', selectedFile);

    axios.post('/uploadLinks', {
      links
    })
    .then(response => {
      setOutput(response.data);
      setStatusInfo({totalSku: '-', selectedSites: '-', totalSkuWithSites: '-', checked: '-', percent: '100'});
      $('.upload-btn-wrapper button img').attr('src', 'https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-21.png');
      $('.inpBtn input, button').removeAttr('disabled');
      $('.links > div').on('click');
      $('#app button').css({background: '#fff'});
    })
    .catch(err => {
      console.log(err);
    });
      
    axios.post('/upload', formData)
      .then(response => {
        setOutput(response.data);
        response.data && localStorage.setItem('obj', JSON.stringify(response.data));
        window.location.reload();
        $('.upload-btn-wrapper button img').attr('src', 'https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-21.png');
        $('.inpBtn input, button').removeAttr('disabled');
        $('.links > div').css({border: '0px solid #000'});
        $('.links > div').on('click');

        /* setTimeout(() => {
          window.location.href = 'http://78.46.254.73:8888/download';
        }, 1000); */
      })
      .catch(error => {
        console.error(error);
      });
    }
  };

  const tapazFunc = (e) => {
    $('.links div').css({border: '0px solid #000'});
    links[0].toggle = false;
    links[1].toggle = false;
    links[2].toggle = false;
    links[3].toggle = false;
    links[4].toggle = false;
    links[5].toggle = false;
    links[6].toggle = false;
    links[7].toggle = false;
    links[8].toggle = false;
    links[9].toggle = false;
    links[10].toggle = !links[10].toggle; 
    links[10].toggle ? $(e.target).css({border: '2px solid orange'}) : $(e.target).css({border: '0px solid #000'});
    links[11].toggle = false;
    links[12].toggle = false;
    links[13].toggle = false;
  }

  const umicoFunc = (e) => {
    $('.links div').css({border: '0px solid #000'});
    links[0].toggle = false;
    links[1].toggle = false;
    links[2].toggle = false;
    links[3].toggle = false;
    links[4].toggle = false;
    links[5].toggle = false;
    links[6].toggle = false;
    links[7].toggle = false;
    links[8].toggle = false;
    links[9].toggle = false;
    links[10].toggle = false;
    links[11].toggle = !links[11].toggle; 
    links[11].toggle ? $(e.target).css({border: '2px solid violet'}) : $(e.target).css({border: '0px solid #000'});
    links[12].toggle = false;
    links[13].toggle = false;
  }

  return (
    <div id='app'>
      <div className="left">
        <div className="inpBtn">
          <input onChange={(e) => {setSku(e.target.value)}} type="text" placeholder='SKU' />
          <button onClick={searchFunc}><img src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-21.png" alt="search" /></button>
        </div>
        <div className="inpBtn upload-btn-wrapper">
          <button className="btn" style={{background: selectedFile && "#ddd"}}>Faylı yüklə</button>
            {selectedFile === null ? <input type="file" name="myfile" onChange={handleFileChange} /> : null}
          <button className="btnUpload" onClick={handleUpload}><img src="https://www.freeiconspng.com/thumbs/search-icon-png/search-icon-png-21.png" alt="search" /></button>
        </div>
        <div className="links">
          <div onClick={(e) => {links[0].toggle = !links[0].toggle; links[0].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>noutbuklar.az</div>
          <div onClick={(e) => {links[1].toggle = !links[1].toggle; links[1].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>deltastore.az</div>
          <div onClick={(e) => {links[2].toggle = !links[2].toggle; links[2].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>icomp.az</div>
          <div onClick={(e) => {links[3].toggle = !links[3].toggle; links[3].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>compstore.az</div>
          <div onClick={(e) => {links[4].toggle = !links[4].toggle; links[4].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>notecomp.az</div>
          <div onClick={(e) => {links[5].toggle = !links[5].toggle; links[5].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>aztechshop.az</div>
          <div onClick={(e) => {links[6].toggle = !links[6].toggle; links[6].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>texnomart.az</div>
          <div onClick={(e) => {links[7].toggle = !links[7].toggle; links[7].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>amazoncomp.az</div>
          <div onClick={(e) => {links[8].toggle = !links[8].toggle; links[8].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>bakinity.biz</div>
          <div onClick={(e) => {links[9].toggle = !links[9].toggle; links[9].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>bermud.az</div>
          <div onClick={tapazFunc}>tap.az</div>
          <div onClick={umicoFunc}>umico.az</div>
          <div onClick={(e) => {links[12].toggle = !links[12].toggle; links[12].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>bakuelectronics.az</div>
          <div onClick={(e) => {links[13].toggle = !links[13].toggle; links[13].toggle ? $(e.target).css({border: '2px solid #000'}) : $(e.target).css({border: '0px solid #000'}); $('.links div').eq(10).css({border: '0px solid #000'}); links[10].toggle = false; $('.links div').eq(11).css({border: '0px solid #000'}); links[11].toggle = false}}>kontakt.az</div>
        </div>
      </div>

      {/* <div className='output'>
        {output && output.map((e, i) => {
          return <div className="item" key={'key' + i}><span>{e.site} </span> | <a target='__blank' href={e.url}> {e.name} </a> | <span style={{color: 'green', fontWeight: 'bold'}}> {e.price} </span></div>
        })}
      </div> */}
      <div className="sidebar">
        <div className='percent'>
          <span>{statusInfo ? statusInfo.percent + '%' : '-'}</span>
          <div>
            <span>Cədvəldə verilən SKU sayı: {statusInfo ? statusInfo.totalSku : '-'}</span>
            <span>Saytların sayı: {statusInfo ? statusInfo.selectedSites : '-'}</span>
            <span>Ümumi yoxlanılan SKU sayı: {statusInfo ? statusInfo.totalSkuWithSites : '-'}</span>
            <span>Yoxlanılıb: {statusInfo ? statusInfo.checked : '-'}</span>
          </div>
        </div>
        <div className='logsWrap'>
        <div>Hazırda tapılanlar</div>
          {statusInfo?.obj?.length > 0 && statusInfo.obj?.map(e => {
            return <span>{JSON.stringify(e)}</span>
          })}
        </div>
        <div className='logsWrap latest'>
          <div>Son tapılanlar</div>
          {localStorage.getItem('obj') && JSON.parse(localStorage.getItem('obj')).map(e => {
            return <span>{JSON.stringify(e)}</span>
          })}
        </div>
      </div>
    </div>
  );
};

export default App;