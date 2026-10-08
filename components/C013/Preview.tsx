import TrendChip from './index';
export default function Preview(){return <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><TrendChip/><TrendChip value="-1.12%" trend="down"/><TrendChip value="Assets" trend="neutral" soft/></div>;}
