import React, { ReactNode } from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">개인정보 처리방침</h1>

      <p className="text-gray-700 mb-4">
        국민대학교 소프트웨어융합대학 웹 개발 동아리 WINK(이하 &quot;WINK&quot;)는 지원자와 부원의
        개인정보를 중요하게 생각합니다. 이 방침은 WINK 홈페이지와 신입 부원 모집 과정에서 수집한
        개인정보를 어떤 목적으로 처리하고, 언제까지 보관하며, 어떻게 보호하는지 안내합니다.
      </p>

      <Section title="1. 수집하는 개인정보">
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            <strong>지원자 기본정보</strong>: 이름, 학번, 학부(과), 이메일 주소, 전화번호
          </li>
          <li>
            <strong>지원서 및 전형정보</strong>: 지원 동기, 자기소개, 대외활동, 면접 가능한 날짜와
            별도 일정 조율 필요 여부, GitHub 주소, 기술 스택, 프로젝트 경험, 전형 결과
          </li>
          <li>
            <strong>서비스 이용정보</strong>: 접속 기록 등 서비스 이용 과정에서 자동으로 생성되는
            정보
          </li>
        </ul>
        <p className="text-gray-700 mt-3">
          제시된 날짜에 면접이 어려운 경우에는 별도 일정 조율이 필요하다는 선택값만 수집하며, 건강,
          장애 등 개인 사유는 수집하지 않습니다.
        </p>
      </Section>

      <Section title="2. 개인정보의 이용 목적">
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>지원자 식별, 중복 지원 확인 및 지원서 접수·수정</li>
          <li>서류 및 면접 전형 심사, 면접 일정 조율과 전형 결과 안내</li>
          <li>지원 관련 문의 대응과 필요한 안내 메일·문자 발송</li>
          <li>합격자의 회원 전환, 부원 전용 서비스 제공 및 활동 관리</li>
        </ul>
      </Section>

      <Section title="3. 개인정보의 보관 기간">
        <p className="text-gray-700 mb-2">
          지원서와 전형정보는 해당 모집 전형이 종료된 날부터 <strong>90일간</strong> 보관한 뒤
          복구하기 어려운 방법으로 파기합니다. 관계 법령에 따라 별도 보관이 필요한 경우에는 해당
          법령에서 정한 기간 동안 분리하여 보관할 수 있습니다.
        </p>
        <p className="text-gray-700">
          합격자의 경우 회원 전환과 동아리 운영에 필요한 최소한의 기본정보만 별도로 처리하며, 지원
          동기·자기소개·대외활동·면접 일정 등 전형 심사용 정보는 동일하게 전형 종료 후 90일 이내
          파기합니다. 회원정보의 보관 기간과 삭제 방법은 회원 전환 과정에서 별도로 안내합니다.
        </p>
      </Section>

      <Section title="4. 개인정보 처리의 위탁">
        <p className="text-gray-700 mb-2">
          WINK는 지원 확인 메일과 전형 안내 문자를 발송하기 위해 SMTP·메일 전송 서비스 및 문자 발송
          서비스를 이용할 수 있습니다. 이 경우 서비스 제공자는 이름, 이메일 주소, 전화번호와 발송
          내용 등 메시지 전달에 필요한 최소한의 정보만 처리합니다.
        </p>
        <p className="text-gray-700">
          이용하는 업체, 처리 지역과 세부 조건은 실제 운영 환경 및 계약에 따라 달라질 수 있습니다.
          처리위탁 또는 국외 처리가 발생하는 경우 확정된 업체명, 위탁 업무, 보유 기간 등 필요한
          내용을 적용 전에 이 방침이나 별도 안내를 통해 공개합니다.
        </p>
      </Section>

      <Section title="5. 개인정보의 제3자 제공">
        <p className="text-gray-700">
          WINK는 지원자의 개인정보를 수집·이용 목적의 범위에서 처리하며, 지원자의 동의나 법적 근거가
          있는 경우를 제외하고 제3자에게 제공하지 않습니다.
        </p>
      </Section>

      <Section title="6. 개인정보의 안전성 확보 조치">
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            <strong>접근 제한</strong>: 모집과 운영에 필요한 권한이 있는 담당자만 개인정보에
            접근하도록 제한
          </li>
          <li>
            <strong>전송 및 저장 보호</strong>: 전송 구간과 저장 매체 보호, 인증정보 보호 등 필요한
            기술적 조치 적용
          </li>
          <li>
            <strong>최소 수집과 파기</strong>: 모집 목적에 필요한 범위로 수집하고 보관 기간이 지나면
            지체 없이 파기
          </li>
        </ul>
      </Section>

      <Section title="7. 개인정보 자동 수집 및 로그 정보">
        <p className="text-gray-700">
          WINK는 서비스의 안정적인 제공과 보안 사고 대응을 위해 접속 기록 등 로그 정보를 수집할 수
          있습니다. 해당 정보는 목적 달성에 필요한 기간 동안만 접근을 제한하여 보관합니다.
        </p>
      </Section>

      <Section title="8. 개인정보에 관한 권리와 행사 방법">
        <p className="text-gray-700 mb-2">
          지원자와 부원은 본인의 개인정보에 대한 열람, 정정, 삭제 또는 처리정지를 요청할 수
          있습니다. 지원서 수정 기능을 이용하거나 아래 문의처로 연락해 요청할 수 있으며, WINK는 본인
          확인 후 관련 법령이 정한 범위에서 처리합니다.
        </p>
        <p className="text-gray-700">
          지원에 필요한 개인정보 수집·이용에 동의하지 않을 수 있으나, 필수정보 처리를 거부하면
          지원서 접수와 전형 진행이 어렵습니다.
        </p>
      </Section>

      <Section title="9. 개인정보 보호 문의처">
        <p className="text-gray-700">
          개인정보 보호, 열람·정정·삭제 요청과 관련된 문의는 아래 이메일을 통해 접수할 수 있습니다.
        </p>
        <p className="text-gray-900 font-semibold">이메일: kmucs.wink@gmail.com</p>
      </Section>

      <Section title="10. 개인정보 처리방침 변경">
        <p className="text-gray-700">
          본 개인정보 처리방침은 <strong>2026년 7월 29일</strong>부터 시행합니다. 내용이 변경되는
          경우 시행 전에 WINK 홈페이지를 통해 안내하겠습니다.
        </p>
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      {children}
    </div>
  );
}
