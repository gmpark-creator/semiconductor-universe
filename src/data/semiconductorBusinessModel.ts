// 반도체 「사업 모델」 모드 데이터 — 팹리스/파운드리/IDM 업체별 설계·제조.
// 워크플로 6에이전트(초안 3 + 적대적 사실검증 3)로 생성·검증. 회사 분류·역할은 2024~2025 기준 개념 설명.
import type { BusinessModelInfo } from "./types";

export const SEMI_BUSINESS_MODEL: BusinessModelInfo = {
  "hint": "팹리스·파운드리·IDM — 설계와 제조를 누가 맡는가",
  "listTitle": "사업 모델",
  "intro": "반도체 회사는 '설계'와 '제조'를 어떻게 나누느냐에 따라 크게 셋으로 나뉩니다. 팹리스는 설계만 하고 제조를 파운드리에 맡기고, 파운드리는 자사 제품 설계 없이 고객 칩을 위탁생산만 하며, IDM은 설계와 제조를 모두 자사에서 합니다. (장비·소재·EDA/IP 기업은 이 세 모델과 별개의 보조 축입니다.)",
  "groups": [
    {
      "id": "fabless",
      "label": "팹리스 (Fabless)",
      "modelSummary": "팹리스는 칩의 설계에만 집중하고, 자체 생산 공장(팹)을 두지 않는 사업모델이다. 설계가 끝난 도면은 TSMC 같은 파운드리에 위탁해 생산한다. 막대한 비용이 드는 공장 투자와 운영 부담을 덜고, 회로 설계와 소프트웨어 같은 핵심 역량에만 자원을 집중할 수 있다.",
      "designMark": "설계 O (자사 칩을 직접 설계)",
      "manufMark": "제조 X (자사 팹 없음, 파운드리에 위탁)",
      "companies": [
        {
          "id": "nvidia",
          "name": "NVIDIA",
          "oneLiner": "AI·GPU 팹리스",
          "design": "데이터센터용 AI 가속기와 그래픽 처리 장치(GPU)를 직접 설계한다. 대표 제품으로 H100·B200 같은 AI GPU와 GeForce 게이밍 GPU가 있으며, CUDA 소프트웨어 생태계까지 함께 개발해 하드웨어와 묶어 제공한다.",
          "manufacturing": "자사 팹이 없어 실제 칩 생산은 TSMC의 선단 공정에 위탁한다. HBM 같은 고대역폭 메모리와 함께 패키징하는 첨단 후공정(CoWoS 등)도 TSMC에 의존한다.",
          "note": "AI 학습·추론용 가속기 시장에서 사실상 표준 지위를 차지하며, 공급 병목은 주로 TSMC의 첨단 패키징 생산능력에서 발생한다."
        },
        {
          "id": "apple",
          "name": "Apple",
          "oneLiner": "모바일·PC SoC 팹리스",
          "design": "iPhone·iPad·Mac에 들어가는 자체 SoC(시스템 온 칩)를 설계한다. 아이폰용 A 시리즈와 맥용 M 시리즈가 대표적이며, CPU·GPU·신경망 엔진(NPU)을 하나의 칩에 통합한다.",
          "manufacturing": "자사 팹이 없으며, 칩 생산 전량을 TSMC에 위탁한다. 통상 TSMC의 가장 앞선 공정(예: 3nm)을 초기에 단독으로 확보해 신제품에 먼저 적용하는 경우가 많다.",
          "note": "ARM 명령어 집합 아키텍처(ISA) 기반으로 칩을 설계하며, 만든 칩은 외부에 팔지 않고 자사 완제품에만 탑재한다."
        },
        {
          "id": "amd",
          "name": "AMD",
          "oneLiner": "CPU·GPU 팹리스",
          "design": "PC·서버용 CPU와 GPU를 설계한다. 대표 제품으로 Ryzen·EPYC CPU, Radeon GPU, AI 가속기 Instinct(MI 시리즈)가 있으며, 여러 작은 칩을 이어 붙이는 칩렛(chiplet) 설계 방식을 적극 활용한다.",
          "manufacturing": "자사 팹이 없어 생산은 TSMC를 중심으로 위탁한다. 선단 공정 제품은 TSMC에서 만들고, 과거 자사 공장 부문을 분사해 만든 GlobalFoundries에는 입출력(I/O)·구형 공정 등 일부 물량을 맡긴다.",
          "note": "2009년 제조 부문을 분리(현 GlobalFoundries)하며 팹리스로 전환했고, 최신 선단 공정 제품은 TSMC에서 생산한다."
        },
        {
          "id": "broadcom",
          "name": "Broadcom",
          "oneLiner": "통신·네트워크 칩 팹리스",
          "design": "네트워크 스위치·라우터용 칩, 무선 통신(Wi-Fi·Bluetooth) 칩, 고객 맞춤형 ASIC을 설계한다. 대형 빅테크 기업의 AI 가속기를 함께 설계해주는 맞춤형 실리콘 사업도 크다.",
          "manufacturing": "선단 로직 칩 생산은 자사 팹 없이 TSMC 등 외부 파운드리에 위탁하는 팹리스 모델로 운영한다. 일부 구형 특수 부품(RF 필터 등)을 만드는 작은 자체 라인을 보유하기도 하지만, 첨단 공정 칩 제조는 전적으로 파운드리에 맡긴다.",
          "note": "데이터센터 네트워킹과 고객 맞춤형 AI 칩(ASIC) 분야에서 강하며, 인프라 소프트웨어 사업도 함께 운영한다."
        },
        {
          "id": "qualcomm",
          "name": "Qualcomm",
          "oneLiner": "모바일 AP·모뎀 팹리스",
          "design": "스마트폰용 통합 칩 Snapdragon(애플리케이션 프로세서)과 셀룰러 모뎀을 설계한다. 5G 통신 핵심 특허(IP)를 다수 보유해 칩 판매와 별도로 라이선스 수익도 얻는다.",
          "manufacturing": "자사 팹이 없어 생산은 TSMC와 Samsung Foundry 등 외부 파운드리에 위탁한다.",
          "note": "통신 표준특허 라이선스 사업이 매출의 중요한 축이며, 칩 제조는 전적으로 파운드리에 의존한다."
        },
        {
          "id": "mediatek",
          "name": "MediaTek",
          "oneLiner": "모바일 SoC 팹리스",
          "design": "스마트폰·태블릿·스마트TV용 SoC를 설계한다. 대표 제품으로 Dimensity·Helio 시리즈가 있으며, 중저가에서 프리미엄까지 폭넓은 모바일 칩 라인업을 갖췄다.",
          "manufacturing": "자사 팹이 없으며, 칩 생산은 TSMC를 중심으로 외부 파운드리에 위탁한다.",
          "note": "대만 기업으로 출하량 기준 세계 최대 규모의 스마트폰 칩 공급사 중 하나이며, Qualcomm과 모바일 SoC 시장에서 경쟁한다."
        }
      ]
    },
    {
      "id": "foundry",
      "label": "파운드리 (Foundry)",
      "modelSummary": "파운드리는 자사 브랜드의 칩을 직접 설계하지 않고, 팹리스(NVIDIA, Apple 등)나 IDM 고객이 건네준 설계 데이터를 받아 실제 반도체를 만들어 주는 위탁생산 전문 기업이다. 즉 설계는 고객이, 제조는 파운드리가 담당하는 분업 구조이며, 파운드리는 거대한 첨단 팹(생산 공장)과 EUV 같은 공정 기술에 집중 투자한다. 고객은 공장 없이 설계만으로 칩을 양산할 수 있어, 반도체 산업의 수평 분업을 떠받치는 핵심 축이다.",
      "designMark": "설계 X (고객 설계를 받아 위탁생산)",
      "manufMark": "제조 O (자사 첨단 팹에서 고객 칩 양산)",
      "companies": [
        {
          "id": "tsmc",
          "name": "TSMC",
          "oneLiner": "선단 공정 1위 순수 파운드리",
          "design": "자사 브랜드 칩을 설계하지 않는다. NVIDIA의 GPU, Apple의 A·M 시리즈 SoC, AMD의 CPU·GPU 등 팹리스 고객이 건넨 설계(GDS)를 그대로 받아 생산만 담당한다. 다만 고객 설계를 돕는 공정 설계 키트(PDK)와 일부 IP는 제공한다.",
          "manufacturing": "대만을 중심으로 세계 최대 규모의 첨단 팹을 운영하며, 3nm·5nm 등 최선단 노드를 EUV 노광으로 양산한다. 첨단 패키징(CoWoS 등)으로 HBM과 로직을 묶는 AI 가속기 생산까지 맡는다.",
          "note": "순수 파운드리(Pure-play)로 자사 제품이 없어 고객과 경쟁하지 않는 점이 강점이며, 선단 노드 점유율에서 업계 선두다."
        },
        {
          "id": "samsung-foundry",
          "name": "Samsung Foundry",
          "oneLiner": "선단 공정 추격 파운드리 (삼성전자 사업부)",
          "design": "파운드리 사업부 자체는 고객 칩을 설계하지 않고 위탁생산한다. 같은 삼성전자 안의 시스템LSI(엑시노스 설계)나 메모리 사업부는 별개 조직이며, 파운드리는 이들과 외부 고객의 설계를 받아 제조한다.",
          "manufacturing": "한국(기흥·화성·평택)과 미국 테일러 팹에서 GAA(Gate-All-Around) 기반 3nm 등 선단 공정을 양산한다. 업계 최초로 3nm에 GAA 구조를 적용했으며, EUV 노광 라인을 갖추고 모바일 AP, 일부 AI 칩 등을 생산한다.",
          "note": "엑시노스 설계는 시스템LSI, 메모리(DRAM·NAND)는 별도 사업부 소관으로, 파운드리는 그중 제조 위탁 부문만 가리킨다. 세계 1위 TSMC를 추격하는 2위권이다."
        },
        {
          "id": "intel-foundry",
          "name": "Intel Foundry",
          "oneLiner": "후발 진입 파운드리 (Intel 사내 분리 사업)",
          "design": "파운드리 사업으로서는 외부 고객 칩을 설계하지 않고 위탁생산을 지향한다. 모회사 Intel의 CPU 설계 부문과는 별개로, 외부 팹리스 고객 유치를 목표로 Intel Foundry(옛 IFS) 형태의 독립 사업 단위로 운영한다.",
          "manufacturing": "미국(애리조나·오하이오 등)과 아일랜드 팹에서 Intel 18A 등 선단 노드를 개발·양산하며, EUV를 도입해 자사 CPU와 외부 고객 물량을 함께 생산하려 한다.",
          "note": "원래 자사 칩만 만들던 IDM이었으나, 외부 고객을 받기 위해 제조 부문을 별도 사업 단위로 분리·확장하는 후발주자다."
        },
        {
          "id": "globalfoundries",
          "name": "GlobalFoundries",
          "oneLiner": "성숙·특화 공정 파운드리",
          "design": "자사 브랜드 칩을 설계하지 않는 순수 파운드리다. 자동차·산업·통신용 칩을 만드는 고객의 설계를 받아 위탁생산한다.",
          "manufacturing": "미국·독일·싱가포르 팹에서 12nm 이상의 성숙(레거시) 노드와 RF-SOI, 임베디드 메모리 같은 특화 공정을 양산한다. 최선단 EUV 미세화 경쟁에는 뛰어들지 않는다.",
          "note": "7nm 이하 최선단 개발을 포기하고 자동차·IoT 등 안정적 성숙 노드 시장에 집중하는 전략을 택했다."
        },
        {
          "id": "smic",
          "name": "SMIC",
          "oneLiner": "중국 최대 파운드리",
          "design": "자사 제품을 설계하지 않는 파운드리로, 중국 내외 팹리스 고객의 설계를 받아 위탁생산한다.",
          "manufacturing": "중국(상하이·베이징 등) 팹에서 성숙 노드를 주력으로 양산하며, EUV 장비 수입 제재로 인해 DUV 노광 기반의 7nm급을 사실상 최선단 한계로 한다.",
          "note": "미국의 첨단 장비(특히 EUV) 수출 규제로 선단 노드 진입이 제약되어, TSMC·삼성 대비 미세 공정에서 뒤처진다."
        }
      ]
    },
    {
      "id": "idm",
      "label": "IDM (종합반도체)",
      "modelSummary": "IDM(Integrated Device Manufacturer, 종합반도체)은 칩의 설계와 제조를 모두 자사 안에서 직접 수행하는 사업모델이다. 팹리스가 설계만 하고 파운드리에 위탁하는 것과 달리, IDM은 자체 설계팀과 자체 팹(반도체 공장)을 함께 보유하여 한 회사가 처음부터 끝까지 책임진다. 다만 최근에는 자사 팹의 빈 생산능력을 활용해 외부 고객의 칩까지 위탁생산하는 파운드리 사업을 함께 운영하거나, 반대로 일부 공정·물량을 외부 파운드리(TSMC 등)에 맡기는 IDM도 늘고 있다.",
      "designMark": "설계 O (자사 칩을 직접 설계)",
      "manufMark": "제조 O (자사 팹에서 직접 생산)",
      "companies": [
        {
          "id": "intel",
          "name": "Intel",
          "oneLiner": "CPU 중심 종합반도체 IDM",
          "design": "PC·서버용 x86 CPU(Core, Xeon)와 그래픽·AI 가속기 등을 자사가 직접 설계한다. 명령어 집합(x86)과 코어 마이크로아키텍처를 자체 보유한 대표적 설계 주체다.",
          "manufacturing": "미국·아일랜드 등 자사 팹에서 자사 CPU를 직접 양산한다. 동시에 Intel Foundry 사업을 통해 외부 고객의 칩도 위탁생산하기 시작했다.",
          "note": "선단 공정(미세 노드)에서는 한때 TSMC에 뒤처져 일부 타일(칩 블록)을 TSMC에 위탁하기도 하며, 파운드리 진입으로 설계와 외부 수탁 제조를 함께하는 IDM 2.0 전략을 추진 중이다."
        },
        {
          "id": "samsung",
          "name": "Samsung",
          "oneLiner": "메모리·로직 겸업 IDM(+파운드리)",
          "design": "스마트폰용 AP인 Exynos(SoC), 이미지센서, 그리고 DRAM·NAND 메모리 등 자사 제품을 직접 설계한다. 설계는 시스템LSI 사업부(로직)와 메모리 사업부로 나뉜다.",
          "manufacturing": "국내외 자사 팹에서 DRAM·NAND·자사 로직 칩을 직접 양산한다. 별도 파운드리 사업부를 통해 외부 고객의 칩(3nm GAA 등)도 위탁생산한다.",
          "note": "Exynos 설계는 시스템LSI, 메모리는 별도 사업부 소관이며, 파운드리는 또 다른 독립 사업부로 분리 운영된다. 설계·자사 제조·외부 수탁을 모두 갖춘 보기 드문 형태다."
        },
        {
          "id": "skhynix",
          "name": "SK hynix",
          "oneLiner": "메모리 전문 IDM",
          "design": "DRAM, NAND, 그리고 AI 서버용 고대역폭 메모리인 HBM 등 메모리 제품을 자사가 직접 설계한다.",
          "manufacturing": "국내외 자사 팹에서 DRAM·NAND·HBM을 직접 양산한다. 핵심 메모리는 설계부터 생산까지 자체 수행하는 메모리 IDM이다.",
          "note": "AI 가속기에 쓰이는 HBM 분야에서 강한 경쟁력을 보유해 NVIDIA 등 AI 칩 고객에 공급한다. 차세대 HBM의 베이스 다이(로직) 일부는 TSMC와 협력하기도 한다."
        },
        {
          "id": "micron",
          "name": "Micron",
          "oneLiner": "메모리 전문 IDM",
          "design": "DRAM, NAND, HBM 등 메모리 제품을 자사가 직접 설계한다. 미국계 대표 메모리 설계 주체다.",
          "manufacturing": "미국·일본·대만 등 자사 팹에서 DRAM·NAND를 직접 양산한다. 설계와 제조를 모두 자체 수행하는 메모리 IDM이다.",
          "note": "Samsung·SK hynix와 함께 글로벌 DRAM 3강 중 하나이며, HBM 시장에도 본격 진입했다."
        },
        {
          "id": "ti",
          "name": "Texas Instruments",
          "oneLiner": "아날로그·임베디드 IDM",
          "design": "전원관리(PMIC), 신호체인 등 아날로그 칩과 임베디드 마이크로컨트롤러(MCU)를 자사가 직접 설계한다. 수만 종의 아날로그 제품 포트폴리오를 보유한다.",
          "manufacturing": "미국 등 자사 팹에서 자사 아날로그·임베디드 칩을 직접 양산한다. 자체 300mm 아날로그 팹 투자를 늘려 제조 내재화를 강화하고 있다.",
          "note": "선단 미세공정 경쟁이 아닌 성숙(legacy) 공정 기반의 아날로그·MCU에 집중하는 IDM이다."
        },
        {
          "id": "infineon",
          "name": "Infineon",
          "oneLiner": "전력·자동차 반도체 IDM",
          "design": "전력반도체(파워 IGBT·MOSFET), 자동차용 칩, 보안 칩 등을 자사가 직접 설계한다. SiC·GaN 등 차세대 전력소자 설계에 강점이 있다.",
          "manufacturing": "유럽·아시아 등 자사 팹에서 전력·자동차 반도체를 직접 양산한다. 다만 일부 물량은 외부 파운드리에도 위탁한다.",
          "note": "유럽계 전력·자동차 반도체 강자로, 전기차·산업용 전력제어 분야에서 핵심 공급사다."
        },
        {
          "id": "stmicro",
          "name": "STMicroelectronics",
          "oneLiner": "마이크로컨트롤러·전력 IDM",
          "design": "STM32 마이크로컨트롤러(MCU), MEMS 센서, 전력·아날로그 칩, SiC 전력소자 등을 자사가 직접 설계한다.",
          "manufacturing": "유럽 등 자사 팹에서 MCU·센서·전력 칩을 직접 양산한다. 일부 물량은 외부 파운드리 위탁을 병행한다.",
          "note": "STM32 MCU 제품군과 SiC 전력반도체로 잘 알려진 유럽계 IDM이다."
        },
        {
          "id": "adi",
          "name": "Analog Devices",
          "oneLiner": "고성능 아날로그 IDM(하이브리드 생산)",
          "design": "데이터 컨버터(ADC·DAC), 증폭기, RF·전원관리 등 고성능 아날로그·믹스드시그널 칩을 자사가 직접 설계한다.",
          "manufacturing": "핵심 공정은 자사 팹에서 직접 양산하면서도, 상당 부분을 TSMC 등 외부 파운드리에 맡기는 팹라이트(fab-lite) 하이브리드 생산 구조를 운영한다. 내부·외부 생산능력을 유연하게 오가며 가동률을 높이는 방식이다.",
          "note": "설계는 모두 자체 수행하지만 제조는 자사 팹과 외부 위탁을 병행하는 점에서, 자사 팹만 쓰는 전통 IDM과는 결이 다르다. Maxim Integrated 인수로 전원관리·고정밀 아날로그 포트폴리오를 한층 강화했다."
        }
      ]
    }
  ]
};
