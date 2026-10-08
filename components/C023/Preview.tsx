import TransactionTypeBadge from './index';
export default function Preview(){return <div style={{display:'grid',gap:14}}><TransactionTypeBadge type="Contract Interaction"/><TransactionTypeBadge/><TransactionTypeBadge type="Sent"/><TransactionTypeBadge type="Swapped"/></div>;}
