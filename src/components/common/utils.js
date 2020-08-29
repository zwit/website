export function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export const tmp = [
  // {
  //   "id": "AFG",
  //   "value": 443123
  // },
  // {
  //   "id": "AGO",
  //   "value": 945210
  // },
  // {
  //   "id": "ALB",
  //   "value": 519978
  // },
  // {
  //   "id": "ARE",
  //   "value": 25849
  // },
  // {
  //   "id": "ARG",
  //   "value": 563549
  // },
  // {
  //   "id": "ARM",
  //   "value": 916569
  // },
  // {
  //   "id": "ATA",
  //   "value": 210566
  // },
  // {
  //   "id": "ATF",
  //   "value": 773881
  // },
  // {
  //   "id": "AUT",
  //   "value": 202557
  // },
  // {
  //   "id": "AZE",
  //   "value": 330978
  // },
  // {
  //   "id": "BDI",
  //   "value": 428381
  // },
  // {
  //   "id": "BEL",
  //   "value": 153729
  // },
  // {
  //   "id": "BEN",
  //   "value": 443609
  // },
  // {
  //   "id": "BFA",
  //   "value": 432231
  // },
  // {
  //   "id": "BGD",
  //   "value": 579387
  // },
  // {
  //   "id": "BGR",
  //   "value": 94168
  // },
  // {
  //   "id": "BHS",
  //   "value": 22103
  // },
  // {
  //   "id": "BIH",
  //   "value": 78978
  // },
  // {
  //   "id": "BLR",
  //   "value": 892028
  // },
  // {
  //   "id": "BLZ",
  //   "value": 999904
  // },
  // {
  //   "id": "BOL",
  //   "value": 736461
  // },
  // {
  //   "id": "BRN",
  //   "value": 699729
  // },
  // {
  //   "id": "BTN",
  //   "value": 850469
  // },
  // {
  //   "id": "BWA",
  //   "value": 907716
  // },
  // {
  //   "id": "CAF",
  //   "value": 279336
  // },
  // {
  //   "id": "CAN",
  //   "value": 677892
  // },
  // {
  //   "id": "CHE",
  //   "value": 300057
  // },
  // {
  //   "id": "CHL",
  //   "value": 130811
  // },
  // {
  //   "id": "CHN",
  //   "value": 686782
  // },
  // {
  //   "id": "CIV",
  //   "value": 647569
  // },
  // {
  //   "id": "CMR",
  //   "value": 362594
  // },
  // {
  //   "id": "COG",
  //   "value": 425268
  // },
  // {
  //   "id": "COL",
  //   "value": 87445
  // },
  // {
  //   "id": "CRI",
  //   "value": 624118
  // },
  // {
  //   "id": "CUB",
  //   "value": 804079
  // },
  // {
  //   "id": "-99",
  //   "value": 49837
  // },
  // {
  //   "id": "CYP",
  //   "value": 14826
  // },
  // {
  //   "id": "CZE",
  //   "value": 693245
  // },
  // {
  //   "id": "DEU",
  //   "value": 154108
  // },
  // {
  //   "id": "DJI",
  //   "value": 954042
  // },
  // {
  //   "id": "DNK",
  //   "value": 470763
  // },
  // {
  //   "id": "DOM",
  //   "value": 687165
  // },
  // {
  //   "id": "DZA",
  //   "value": 806761
  // },
  // {
  //   "id": "ECU",
  //   "value": 161431
  // },
  // {
  //   "id": "EGY",
  //   "value": 993207
  // },
  // {
  //   "id": "ERI",
  //   "value": 736438
  // },
  // {
  //   "id": "ESP",
  //   "value": 856782
  // },
  // {
  //   "id": "EST",
  //   "value": 561623
  // },
  // {
  //   "id": "ETH",
  //   "value": 381894
  // },
  // {
  //   "id": "FIN",
  //   "value": 443081
  // },
  // {
  //   "id": "FJI",
  //   "value": 964652
  // },
  // {
  //   "id": "FLK",
  //   "value": 287508
  // },
  // {
  //   "id": "FRA",
  //   "value": 321767
  // },
  // {
  //   "id": "GAB",
  //   "value": 548516
  // },
  // {
  //   "id": "GBR",
  //   "value": 364330
  // },
  // {
  //   "id": "GEO",
  //   "value": 564753
  // },
  // {
  //   "id": "GHA",
  //   "value": 592306
  // },
  // {
  //   "id": "GIN",
  //   "value": 139441
  // },
  // {
  //   "id": "GMB",
  //   "value": 400377
  // },
  // {
  //   "id": "GNB",
  //   "value": 401124
  // },
  // {
  //   "id": "GNQ",
  //   "value": 428899
  // },
  // {
  //   "id": "GRC",
  //   "value": 650663
  // },
  // {
  //   "id": "GTM",
  //   "value": 745198
  // },
  // {
  //   "id": "GUY",
  //   "value": 156596
  // },
  // {
  //   "id": "HND",
  //   "value": 335713
  // },
  // {
  //   "id": "HRV",
  //   "value": 946742
  // },
  // {
  //   "id": "HTI",
  //   "value": 783574
  // },
  // {
  //   "id": "HUN",
  //   "value": 748312
  // },
  // {
  //   "id": "IDN",
  //   "value": 456495
  // },
  // {
  //   "id": "IND",
  //   "value": 348507
  // },
  // {
  //   "id": "IRL",
  //   "value": 219445
  // },
  // {
  //   "id": "IRN",
  //   "value": 814641
  // },
  // {
  //   "id": "IRQ",
  //   "value": 631336
  // },
  // {
  //   "id": "ISL",
  //   "value": 302705
  // },
  // {
  //   "id": "ISR",
  //   "value": 33144
  // },
  // {
  //   "id": "ITA",
  //   "value": 783236
  // },
  // {
  //   "id": "JAM",
  //   "value": 922321
  // },
  // {
  //   "id": "JOR",
  //   "value": 135492
  // },
  // {
  //   "id": "JPN",
  //   "value": 595122
  // },
  // {
  //   "id": "KAZ",
  //   "value": 690457
  // },
  // {
  //   "id": "KEN",
  //   "value": 343602
  // },
  // {
  //   "id": "KGZ",
  //   "value": 45058
  // },
  // {
  //   "id": "KHM",
  //   "value": 876079
  // },
  // {
  //   "id": "OSA",
  //   "value": 801664
  // },
  // {
  //   "id": "KWT",
  //   "value": 314846
  // },
  // {
  //   "id": "LAO",
  //   "value": 318141
  // },
  // {
  //   "id": "LBN",
  //   "value": 668995
  // },
  // {
  //   "id": "LBR",
  //   "value": 136448
  // },
  // {
  //   "id": "LBY",
  //   "value": 615238
  // },
  // {
  //   "id": "LKA",
  //   "value": 510595
  // },
  // {
  //   "id": "LSO",
  //   "value": 458983
  // },
  // {
  //   "id": "LTU",
  //   "value": 141745
  // },
  // {
  //   "id": "LUX",
  //   "value": 158566
  // },
  // {
  //   "id": "LVA",
  //   "value": 533903
  // },
  // {
  //   "id": "MAR",
  //   "value": 503929
  // },
  // {
  //   "id": "MDA",
  //   "value": 738717
  // },
  // {
  //   "id": "MDG",
  //   "value": 67868
  // },
  // {
  //   "id": "MEX",
  //   "value": 401289
  // },
  // {
  //   "id": "MKD",
  //   "value": 613868
  // },
  // {
  //   "id": "MLI",
  //   "value": 882380
  // },
  // {
  //   "id": "MMR",
  //   "value": 792195
  // },
  // {
  //   "id": "MNE",
  //   "value": 384903
  // },
  // {
  //   "id": "MNG",
  //   "value": 117197
  // },
  // {
  //   "id": "MOZ",
  //   "value": 224127
  // },
  // {
  //   "id": "MRT",
  //   "value": 135475
  // },
  // {
  //   "id": "MWI",
  //   "value": 937032
  // },
  // {
  //   "id": "MYS",
  //   "value": 231944
  // },
  // {
  //   "id": "NAM",
  //   "value": 151327
  // },
  // {
  //   "id": "NCL",
  //   "value": 393974
  // },
  // {
  //   "id": "NER",
  //   "value": 634357
  // },
  // {
  //   "id": "NGA",
  //   "value": 346724
  // },
  // {
  //   "id": "NIC",
  //   "value": 828795
  // },
  // {
  //   "id": "NLD",
  //   "value": 118893
  // },
  // {
  //   "id": "NOR",
  //   "value": 329256
  // },
  // {
  //   "id": "NPL",
  //   "value": 997895
  // },
  // {
  //   "id": "NZL",
  //   "value": 23997
  // },
  // {
  //   "id": "OMN",
  //   "value": 390447
  // },
  // {
  //   "id": "PAK",
  //   "value": 397491
  // },
  // {
  //   "id": "PAN",
  //   "value": 864456
  // },
  // {
  //   "id": "PER",
  //   "value": 790162
  // },
  // {
  //   "id": "PHL",
  //   "value": 292347
  // },
  // {
  //   "id": "PNG",
  //   "value": 459981
  // },
  // {
  //   "id": "POL",
  //   "value": 90301
  // },
  // {
  //   "id": "PRI",
  //   "value": 706686
  // },
  // {
  //   "id": "PRT",
  //   "value": 115012
  // },
  // {
  //   "id": "PRY",
  //   "value": 392764
  // },
  // {
  //   "id": "QAT",
  //   "value": 738242
  // },
  // {
  //   "id": "ROU",
  //   "value": 338392
  // },
  // {
  //   "id": "RUS",
  //   "value": 984266
  // },
  // {
  //   "id": "RWA",
  //   "value": 468574
  // },
  // {
  //   "id": "ESH",
  //   "value": 413623
  // },
  // {
  //   "id": "SAU",
  //   "value": 319919
  // },
  // {
  //   "id": "SDN",
  //   "value": 448935
  // },
  // {
  //   "id": "SDS",
  //   "value": 333985
  // },
  // {
  //   "id": "SEN",
  //   "value": 449523
  // },
  // {
  //   "id": "SLB",
  //   "value": 850152
  // },
  // {
  //   "id": "SLE",
  //   "value": 227733
  // },
  // {
  //   "id": "SLV",
  //   "value": 427245
  // },
  // {
  //   "id": "ABV",
  //   "value": 561506
  // },
  // {
  //   "id": "SOM",
  //   "value": 106277
  // },
  // {
  //   "id": "SRB",
  //   "value": 260965
  // },
  // {
  //   "id": "SUR",
  //   "value": 620277
  // },
  // {
  //   "id": "SVK",
  //   "value": 183681
  // },
  // {
  //   "id": "SVN",
  //   "value": 556055
  // },
  // {
  //   "id": "SWZ",
  //   "value": 317143
  // },
  // {
  //   "id": "SYR",
  //   "value": 708340
  // },
  // {
  //   "id": "TCD",
  //   "value": 195935
  // },
  // {
  //   "id": "TGO",
  //   "value": 466509
  // },
  // {
  //   "id": "THA",
  //   "value": 518712
  // },
  // {
  //   "id": "TJK",
  //   "value": 994600
  // },
  // {
  //   "id": "TKM",
  //   "value": 746121
  // },
  // {
  //   "id": "TLS",
  //   "value": 982540
  // },
  // {
  //   "id": "TTO",
  //   "value": 599142
  // },
  // {
  //   "id": "TUN",
  //   "value": 440328
  // },
  // {
  //   "id": "TUR",
  //   "value": 439147
  // },
  // {
  //   "id": "TWN",
  //   "value": 230747
  // },
  // {
  //   "id": "TZA",
  //   "value": 712069
  // },
  // {
  //   "id": "UGA",
  //   "value": 368313
  // },
  // {
  //   "id": "UKR",
  //   "value": 23334
  // },
  // {
  //   "id": "URY",
  //   "value": 273675
  // },
  // {
  //   "id": "USA",
  //   "value": 696633
  // },
  // {
  //   "id": "UZB",
  //   "value": 993179
  // },
  // {
  //   "id": "VEN",
  //   "value": 279281
  // },
  // {
  //   "id": "VNM",
  //   "value": 438241
  // },
  // {
  //   "id": "VUT",
  //   "value": 545033
  // },
  // {
  //   "id": "PSE",
  //   "value": 118969
  // },
  // {
  //   "id": "YEM",
  //   "value": 166040
  // },
  // {
  //   "id": "ZAF",
  //   "value": 624493
  // },
  // {
  //   "id": "ZMB",
  //   "value": 719462
  // },
  // {
  //   "id": "ZWE",
  //   "value": 560072
  // },
  // {
  //   "id": "KOR",
  //   "value": 843765
  // },
  // {
  //   "id": "KOR",
  //   "value": 843765
  // },
  // {
  //   "id": "BRA",
  //   "value": 243265
  // },
  // {
  //   "id": "AUS",
  //   "value": 74765
  // },
  // {
  //   "id": "SWE",
  //   "value": 340765
  // },
  // {
  //   "id": "GRL",
  //   "value": 643765
  // },
  // {
  //   "id": "COD",
  //   "value": 443765
  // },
  {
    "id": "romanEmpire200CE",
    "value": 43765
  },
  {
    "id": "romanEmpire69CE",
    "value": 43765000
  },
  {
    "id": "romanEmpire14CE",
    "value": 43765000
  },
  {
    "id": "romanEmpire60BCE",
    "value": 43765000
  },
  {
    "id": "romanEmpire117CE",
    "value": 43765000
  },
  {
    "id": "assyrian",
    "value": 465000
  },
  {
    "id": "inca",
    "value": 965000
  },
  {
    "id": "Persian",
    "value": 265000,
  },
  {
    "id": "Mongol Golden Horde",
    "value": 765000,
  },
  {
    "id": "Alexander",
    "value": 1665000,
  },
  {
    "id": "Sumerian",
    "value": 365000,
  },
  {
    "id": "Delian League",
    "value": 365000,
  },
  {
    "id": "Abbasid Caliphate",
    "value": 365000,
  },
  {
    "id": "Mongol Ilkhanate",
    "value": 265000,
  },
  {
    "id": "Mongol Yuan",
    "value": 965000,
  },
  {
    "id": "Mongol Chagadai",
    "value": 665000,
  },
  {
    "id": "Holy Roman Empire",
    "value": 165000,
  },
  {
    "id": "Byzantine Empire",
    "value": 165000,
  },
  {
    "id": "Aztec Empire",
    "value": 165000,
  },
  {
    "id": "Ancien Egypt",
    "value": 165000,
  },
  {
    "id": "Mali Empire",
    "value": 165000,
  },
  {
    "id": "Umayyad Caliphate",
    "value": 165000,
  },
  {
    "id": "Ghana Empire",
    "value": 165000,
  },
  {
    "id": "Mayas",
    "value": 165000,
  },
  {
    "id": "Hittites",
    "value": 165000,
  },
  {
    "id": "Babylonians",
    "value": 165000,
  },
  {
    "id": "Delhi Sultanate",
    "value": 165000,
  },
  {
    "id": "Gupta Empire",
    "value": 165000,
  },
  {
    "id": "Phoenicians",
    "value": 165000,
  },
  {
    "id": "Mauryan Empire",
    "value": 165000,
  },
  {
    "id": "Songhai Empire",
    "value": 165000,
  },
  {
    "id": "Tang Dynasty",
    "value": 165000,
  },
  {
    "id": "Minoans",
    "value": 165000,
  },
  {
    "id": "Zhou Dynasty",
    "value": 165000,
  },
  {
    "id": "Shang Dynasty",
    "value": 165000,
  },
  {
    "id": "Song Dynasty",
    "value": 165000,
  },
  {
    "id": "Han Dynasty",
    "value": 165000,
  },
  {
    "id": "Ming Dynasty",
    "value": 165000,
  },
  {
    "id": "Qin Dynasty",
    "value": 165000,
  },
  {
    "id": "Qing Dynasty",
    "value": 165000,
  },
  {
    "id": "Xia Dynasty",
    "value": 165000,
  },
  {
    "id": "Timurid Empire",
    "value": 165000,
  },
  {
    "id": "Neo Assyrian",
    "value": 165000,
  },
];

