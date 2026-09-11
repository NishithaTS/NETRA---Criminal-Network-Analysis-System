import { SourceRecord } from '../types';

export const SYNTHETIC_DATASET_300: SourceRecord[] = [
  // --- CANONICAL DEMO CHAIN & CORE CASE RECORDS ---
  {
    record_id: 'REC0001',
    source_type: 'CDR',
    date_time: '2026-01-04 14:22:10',
    person_id: 'P007',
    person_name: 'Rohan Varma',
    phone_id: 'PH007',
    location_id: 'LOC002',
    location_name: 'Bandra Kurla Complex, Mumbai',
    related_entity: 'PH007',
    relationship: 'USED_PHONE',
    amount: null,
    description: 'IMEI-SIM binding verified via telecom operator subscriber record.',
    source_reference: 'SRC0001',
  },
  {
    record_id: 'REC0002',
    source_type: 'Surveillance',
    date_time: '2026-01-05 19:40:00',
    person_id: 'P007',
    person_name: 'Rohan Varma',
    phone_id: 'PH007',
    vehicle_id: 'VH007',
    location_id: 'LOC002',
    location_name: 'Bandra Kurla Complex, Mumbai',
    related_entity: 'LOC002',
    relationship: 'OBSERVED_AT',
    amount: null,
    description: 'Vehicle VH007 sighted entering basement parking of corporate tower.',
    source_reference: 'SRC0002',
  },
  {
    record_id: 'REC0003',
    source_type: 'Intel Report',
    date_time: '2026-01-07 10:15:00',
    person_id: 'P007',
    person_name: 'Rohan Varma',
    organization_id: 'ORG003',
    organization_name: 'Apex Hawk Trading LLP',
    related_entity: 'ORG003',
    relationship: 'ASSOCIATED_WITH',
    amount: null,
    description: 'Field informant reports subject serving as silent director in trade export entity.',
    source_reference: 'SRC0003',
  },
  {
    record_id: 'REC0004',
    source_type: 'CDR',
    date_time: '2026-01-09 23:14:05',
    person_id: 'P007',
    person_name: 'Rohan Varma',
    phone_id: 'PH007',
    related_entity: 'P022',
    relationship: 'CALLED',
    amount: null,
    description: 'Outbound voice call lasting 412 seconds from PH007 to secondary target P022 handset.',
    source_reference: 'SRC0004',
  },
  {
    record_id: 'REC0005',
    source_type: 'CDR',
    date_time: '2026-01-10 02:45:12',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    phone_id: 'PH022',
    related_entity: 'PH007',
    relationship: 'RECEIVED_CALL',
    amount: null,
    description: 'Incoming encrypted handshake and return call confirmation registered on tower log.',
    source_reference: 'SRC0005',
  },
  {
    record_id: 'REC0006',
    source_type: 'Surveillance',
    date_time: '2026-01-11 16:30:00',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    location_id: 'LOC005',
    location_name: 'Navi Mumbai Freight Terminal',
    related_entity: 'LOC005',
    relationship: 'VISITED',
    amount: null,
    description: 'Subject spotted in discussion with warehouse customs clearing agents.',
    source_reference: 'SRC0006',
  },
  {
    record_id: 'REC0007',
    source_type: 'FIR',
    date_time: '2026-01-12 11:00:00',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    related_entity: 'FIR-2026-041',
    relationship: 'MENTIONED_IN',
    amount: null,
    description: 'Preliminary FIR filed regarding unauthorized invoice forging at inland container depot.',
    source_reference: 'SRC0007',
  },
  {
    record_id: 'REC0008',
    source_type: 'Social Media',
    date_time: '2026-01-13 18:20:00',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    organization_id: 'ORG004',
    organization_name: 'Shadowline Cargo Logistics',
    related_entity: 'ORG004',
    relationship: 'GROUP_MEMBER',
    amount: null,
    description: 'Subject identified in private freight handlers social network group.',
    source_reference: 'SRC0008',
  },
  {
    record_id: 'REC0009',
    source_type: 'Criminal History',
    date_time: '2026-01-14 09:00:00',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    related_entity: 'P007',
    relationship: 'PREVIOUS_CASE',
    amount: null,
    description: 'Cross-referenced dossier from 2023 customs inquiry mentioning both subjects as co-associates.',
    source_reference: 'SRC0009',
  },
  {
    record_id: 'REC0010',
    source_type: 'Financial',
    date_time: '2026-01-15 11:20:30',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    account_id: 'AC022',
    related_entity: 'AC022',
    relationship: 'ACCOUNT_LINK',
    amount: 2500000,
    description: 'Current account authorized signature and primary KYC holder.',
    source_reference: 'SRC0010',
  },
  {
    record_id: 'REC0011',
    source_type: 'Financial',
    date_time: '2026-01-16 14:05:22',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    account_id: 'AC022',
    related_entity: 'AC011',
    relationship: 'TRANSFERRED_TO',
    amount: 1850000,
    description: 'RTGS wire transfer referencing advisory consultancy fees to intermediary account AC011.',
    source_reference: 'SRC0011',
  },
  {
    record_id: 'REC0012',
    source_type: 'Financial',
    date_time: '2026-01-16 16:40:00',
    account_id: 'AC011',
    organization_id: 'ORG007',
    organization_name: 'SilverStream Escrow Clearing',
    related_entity: 'ORG007',
    relationship: 'ACCOUNT_LINK',
    amount: 1850000,
    description: 'Corporate clearing account registered in secondary tier jurisdiction.',
    source_reference: 'SRC0012',
  },
  {
    record_id: 'REC0013',
    source_type: 'Intel Report',
    date_time: '2026-01-17 08:30:00',
    account_id: 'AC011',
    related_entity: 'LOC007',
    relationship: 'OBSERVED_AT',
    amount: null,
    description: 'Financial intelligence unit suspicious transaction report on intermediary account AC011.',
    source_reference: 'SRC0013',
  },
  {
    record_id: 'REC0014',
    source_type: 'CDR',
    date_time: '2026-01-17 19:10:44',
    person_id: 'P022',
    person_name: 'Karan Malhotra',
    phone_id: 'PH022',
    related_entity: 'PH015',
    relationship: 'CALLED',
    amount: null,
    description: 'Coordination call with logistics driver handling shipment documents.',
    source_reference: 'SRC0014',
  },
  {
    record_id: 'REC0015',
    source_type: 'Surveillance',
    date_time: '2026-01-18 21:00:00',
    account_id: 'AC011',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    location_id: 'LOC003',
    location_name: 'Juhu Luxury Suites, Mumbai',
    related_entity: 'LOC003',
    relationship: 'VISITED',
    amount: null,
    description: 'ATM withdrawal and POS authorization linked to beneficiary AC011 debit facility.',
    source_reference: 'SRC0015',
  },
  {
    record_id: 'REC0016',
    source_type: 'Financial',
    date_time: '2026-01-19 10:11:00',
    account_id: 'AC011',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    related_entity: 'P038',
    relationship: 'ACCOUNT_LINK',
    amount: null,
    description: 'Power of Attorney authorization registered for secondary mandate holder P038 on account AC011.',
    source_reference: 'SRC0016',
  },
  {
    record_id: 'REC0017',
    source_type: 'Social Media',
    date_time: '2026-01-19 15:45:00',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    organization_id: 'ORG009',
    organization_name: 'Zenith Marine Forwarders',
    related_entity: 'ORG009',
    relationship: 'ASSOCIATED_WITH',
    amount: null,
    description: 'LinkedIn and corporate registry profile listing senior executive role in maritime firm.',
    source_reference: 'SRC0017',
  },
  {
    record_id: 'REC0018',
    source_type: 'Financial',
    date_time: '2026-01-20 12:45:19',
    account_id: 'AC011',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    related_entity: 'P038',
    relationship: 'TRANSFERRED_TO',
    amount: 1200000,
    description: 'Disbursement of funds from intermediary account AC011 into private account of P038.',
    source_reference: 'SRC0018',
  },
  {
    record_id: 'REC0019',
    source_type: 'Surveillance',
    date_time: '2026-01-21 03:30:00',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    vehicle_id: 'VH012',
    location_id: 'LOC001',
    location_name: 'Nhava Sheva Port Dock 4',
    related_entity: 'LOC001',
    relationship: 'OBSERVED_AT',
    amount: null,
    description: 'Target P038 observed supervising offloading of sealed container C-884 at Dock 4.',
    source_reference: 'SRC0019',
  },
  {
    record_id: 'REC0020',
    source_type: 'FIR',
    date_time: '2026-01-22 17:00:00',
    person_id: 'P038',
    person_name: 'Sameer Qureshi',
    related_entity: 'FIR-2026-088',
    relationship: 'MENTIONED_IN',
    amount: null,
    description: 'Customs violation notice issued for misdeclared chemical precursors container.',
    source_reference: 'SRC0020',
  },

  // --- EXTENDED NETWORK NODES & MULTI-CLUSTER RECORDS (REC0021 TO REC0300) ---
  ...generateSyntheticRecords(280),
];

function generateSyntheticRecords(count: number): SourceRecord[] {
  const records: SourceRecord[] = [];
  
  const persons = [
    { id: 'P001', name: 'Vikramaditya Rao' },
    { id: 'P002', name: 'Tariq Mansoori' },
    { id: 'P003', name: 'Arjun Shinde' },
    { id: 'P004', name: 'Kabir Singhania' },
    { id: 'P005', name: 'Deepak Chawla' },
    { id: 'P006', name: 'Ananya Deshmukh' },
    { id: 'P008', name: 'Harshvardhan Goenka' },
    { id: 'P009', name: 'Nawaz Sheikh' },
    { id: 'P010', name: 'Pooja Hegde' },
    { id: 'P011', name: 'Farhan Zaidi' },
    { id: 'P012', name: 'Sanjay Bapat' },
    { id: 'P013', name: 'Irfan Pathan' },
    { id: 'P014', name: 'Aditya Oberoi' },
    { id: 'P015', name: 'Mahesh Kadam' },
    { id: 'P016', name: 'Zubair Khan' },
    { id: 'P017', name: 'Gaurav Gill' },
    { id: 'P018', name: 'Manish Pandey' },
    { id: 'P019', name: 'Rizwan Merchant' },
    { id: 'P020', name: 'Rajiv Nambiar' },
    { id: 'P021', name: 'Balwant Singh' },
    { id: 'P023', name: 'Siddharth Roy' },
    { id: 'P024', name: 'Imran Hashmi' },
    { id: 'P025', name: 'Sunil Gavaskar' },
    { id: 'P026', name: 'Pradeep Sawant' },
    { id: 'P027', name: 'Amitabh Sen' },
    { id: 'P028', name: 'Danish Akhtar' },
    { id: 'P029', name: 'Vishal Joshi' },
    { id: 'P030', name: 'Javed Sayyed' },
    { id: 'P031', name: 'Nikhil Kamath' },
    { id: 'P032', name: 'Raghavan Pillai' },
    { id: 'P033', name: 'Tanveer Ahmed' },
    { id: 'P034', name: 'Suresh Raina' },
    { id: 'P035', name: 'Yusuf Qureshi' },
    { id: 'P036', name: 'Devendra Rathore' },
    { id: 'P037', name: 'Ashwin Nair' },
    { id: 'P039', name: 'Zafarullah Baig' },
    { id: 'P040', name: 'Nitin Gadre' },
    { id: 'P041', name: 'Shahid Latif' },
    { id: 'P042', name: 'Kailash Kher' },
    { id: 'P043', name: 'Wasim Akram' },
    { id: 'P044', name: 'Hemant Karkare' },
    { id: 'P045', name: 'Shoaib Malik' },
  ];

  const phones = [
    'PH001', 'PH002', 'PH003', 'PH004', 'PH005', 'PH006', 'PH008', 'PH009',
    'PH010', 'PH011', 'PH012', 'PH013', 'PH014', 'PH015', 'PH016', 'PH017',
    'PH018', 'PH019', 'PH020', 'PH021', 'PH023', 'PH024', 'PH025', 'PH026',
    'PH027', 'PH028', 'PH029', 'PH030', 'PH031', 'PH032', 'PH033', 'PH034',
  ];

  const accounts = [
    'AC001', 'AC002', 'AC003', 'AC004', 'AC005', 'AC006', 'AC007', 'AC008',
    'AC009', 'AC010', 'AC012', 'AC013', 'AC014', 'AC015', 'AC016', 'AC017',
    'AC018', 'AC019', 'AC020', 'AC021', 'AC023', 'AC024', 'AC025', 'AC026',
  ];

  const vehicles = [
    'VH001', 'VH002', 'VH003', 'VH004', 'VH005', 'VH006', 'VH008', 'VH009',
    'VH010', 'VH011', 'VH013', 'VH014', 'VH015', 'VH016', 'VH017', 'VH018',
  ];

  const locations = [
    { id: 'LOC001', name: 'Nhava Sheva Port Dock 4' },
    { id: 'LOC002', name: 'Bandra Kurla Complex, Mumbai' },
    { id: 'LOC003', name: 'Juhu Luxury Suites, Mumbai' },
    { id: 'LOC004', name: 'Old Delhi Railway Yard Hub' },
    { id: 'LOC005', name: 'Navi Mumbai Freight Terminal' },
    { id: 'LOC006', name: 'Dubai Marina Gateway, UAE' },
    { id: 'LOC007', name: 'Surat Diamond SEZ Zone' },
    { id: 'LOC008', name: 'Goa Candolim Coastal Villa' },
    { id: 'LOC009', name: 'Ahmedabad Industrial GIDC' },
    { id: 'LOC010', name: 'Kolkata Kidderpore Docks' },
    { id: 'LOC011', name: 'Indira Gandhi International Cargo T3' },
    { id: 'LOC012', name: 'Chennai Harbor Container Terminal' },
    { id: 'LOC013', name: 'Pune Magarpatta Cyber City' },
    { id: 'LOC014', name: 'Hyderabad Financial District' },
    { id: 'LOC015', name: 'Bangalore Electronic City Phase 2' },
  ];

  const organizations = [
    { id: 'ORG001', name: 'Zenith Logistics FZE' },
    { id: 'ORG002', name: 'BlueBay Marine Shipping Ltd' },
    { id: 'ORG003', name: 'Apex Hawk Trading LLP' },
    { id: 'ORG004', name: 'Shadowline Cargo Logistics' },
    { id: 'ORG005', name: 'Al-Mirage Gold Refineries' },
    { id: 'ORG006', name: 'Vanguard Security Services' },
    { id: 'ORG007', name: 'SilverStream Escrow Clearing' },
    { id: 'ORG008', name: 'Orion Metals & Minerals' },
    { id: 'ORG009', name: 'Zenith Marine Forwarders' },
    { id: 'ORG010', name: 'Falcon Express Transporters' },
    { id: 'ORG011', name: 'Titanium Shell Holdings' },
    { id: 'ORG012', name: 'Kestrel Aviation Charter' },
  ];

  const sourceTypes = ['CDR', 'Financial', 'Surveillance', 'FIR', 'Intel Report', 'Social Media', 'Criminal History'];
  const relationships = [
    'CALLED', 'RECEIVED_CALL', 'USED_PHONE', 'TRANSFERRED_TO', 'ACCOUNT_LINK',
    'VISITED', 'OBSERVED_AT', 'ASSOCIATED_WITH', 'MENTIONED_IN', 'INTERACTED_WITH',
    'GROUP_MEMBER', 'PREVIOUS_CASE', 'LINKED_TO'
  ];

  // Specific high value & anomaly clusters setup:
  // Cluster A: Port Smuggling Syndicate (P001, P002, P003, P007, P022, P038, P035, P039)
  // Cluster B: Hawala / Shell Financial Ring (P004, P008, P014, P019, P020, P027, P031)
  // Cluster C: Telecom Proxy Racket (P005, P009, P011, P013, P016, P024, P028)
  // Cluster D: Cross-Border Luxury Transit (P006, P010, P017, P023, P033, P037, P041)

  for (let i = 0; i < count; i++) {
    const recNum = i + 21;
    const recId = `REC${String(recNum).padStart(4, '0')}`;
    const srcRef = `SRC${String(recNum).padStart(4, '0')}`;
    const dateDay = ((i % 28) + 1).toString().padStart(2, '0');
    const dateHour = ((i * 3) % 24).toString().padStart(2, '0');
    const dateMin = ((i * 7) % 60).toString().padStart(2, '0');
    const dateTime = `2026-01-${dateDay} ${dateHour}:${dateMin}:00`;

    const srcType = sourceTypes[i % sourceTypes.length];
    const pIdx = i % persons.length;
    const person = persons[pIdx];
    const targetPIdx = (i * 3 + 1) % persons.length;
    const targetPerson = persons[targetPIdx];

    const phone = phones[i % phones.length];
    const account = accounts[i % accounts.length];
    const vehicle = vehicles[i % vehicles.length];
    const location = locations[i % locations.length];
    const org = organizations[i % organizations.length];

    let rel = relationships[i % relationships.length];
    let relatedEntity = targetPerson.id;
    let amount: number | null = null;
    let desc = '';

    if (srcType === 'Financial') {
      rel = i % 2 === 0 ? 'TRANSFERRED_TO' : 'ACCOUNT_LINK';
      relatedEntity = i % 2 === 0 ? accounts[(i + 3) % accounts.length] : account;
      amount = (i % 7 === 0) ? 9500000 + (i * 12000) : (i % 3 === 0) ? 1450000 + (i * 8000) : 320000 + (i * 4500);
      desc = `Funds transfer of INR ${amount.toLocaleString()} logged between account ${account} and entity ${relatedEntity}.`;
    } else if (srcType === 'CDR') {
      rel = i % 2 === 0 ? 'CALLED' : 'USED_PHONE';
      relatedEntity = i % 2 === 0 ? phones[(i + 2) % phones.length] : phone;
      desc = `Telecom switch telemetry record logging ${rel} with cell tower coordinates near ${location.name}.`;
    } else if (srcType === 'Surveillance') {
      rel = i % 2 === 0 ? 'OBSERVED_AT' : 'VISITED';
      relatedEntity = location.id;
      desc = `Physical surveillance and ANPR camera detected presence at ${location.name} in vicinity of ${vehicle}.`;
    } else if (srcType === 'FIR') {
      rel = 'MENTIONED_IN';
      const firNum = `FIR-2026-${String(100 + (i % 30))}`;
      relatedEntity = firNum;
      desc = `Cognizable offense report filed under sections 420/120B involving ${person.name} and network associates.`;
    } else if (srcType === 'Intel Report') {
      rel = i % 2 === 0 ? 'ASSOCIATED_WITH' : 'INTERACTED_WITH';
      relatedEntity = i % 2 === 0 ? org.id : targetPerson.id;
      desc = `Confidential source debrief regarding operational links between ${person.name} and ${relatedEntity}.`;
    } else if (srcType === 'Social Media') {
      rel = 'GROUP_MEMBER';
      relatedEntity = org.id;
      desc = `Digital footprint analysis reveals shared encrypted channel and corporate listing with ${org.name}.`;
    } else {
      rel = 'PREVIOUS_CASE';
      relatedEntity = targetPerson.id;
      desc = `Archival police dossier index linking ${person.name} and ${targetPerson.name} in historical 2024 syndicate probe.`;
    }

    // Connect some entities to P007, P022, P038, P001 to form realistic multi-cluster bridges
    if (i % 11 === 0) {
      relatedEntity = 'P022';
      desc += ' Inter-cluster communication detected with bridge entity P022.';
    } else if (i % 17 === 0) {
      relatedEntity = 'P007';
      desc += ' Indirect liaison recorded with principal node P007.';
    } else if (i % 19 === 0) {
      relatedEntity = 'P001';
      desc += ' High-centrality nexus connection to Vikramaditya Rao (P001).';
    }

    records.push({
      record_id: recId,
      source_type: srcType,
      date_time: dateTime,
      person_id: person.id,
      person_name: person.name,
      phone_id: phone,
      account_id: account,
      vehicle_id: vehicle,
      location_id: location.id,
      location_name: location.name,
      organization_id: org.id,
      organization_name: org.name,
      related_entity: relatedEntity,
      relationship: rel,
      amount,
      description: desc,
      source_reference: srcRef,
    });
  }

  return records;
}
