import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean, onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. 현재 포커스 된 요소 저장 (모달 닫힐 때 복귀용)
      previousFocusRef.current = document.activeElement as HTMLElement;

      // 2. 모달 내부로 포커스 이동
      // 모달 내 첫 번째 포커스 가능한 요소를 찾거나, 없으면 모달 컨테이너에 포커스
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        modalRef.current?.focus();
      }

      // 3. Tab 키 트랩 이벤트 리스너
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        const focusables = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusables || focusables.length === 0) return;

        const firstElement = focusables[0] as HTMLElement;
        const lastElement = focusables[focusables.length - 1] as HTMLElement;

        // Shift + Tab : 첫 번째 요소에서 누르면 마지막으로 이동
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } 
        // Tab : 마지막 요소에서 누르면 첫 번째로 이동
        else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          handleTabKey(e);
        } else if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      // Body 스크롤 잠금
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
        
        // 4. 모달 닫힐 때 이전 포커스로 복귀
        // setTimeout을 사용하여 모달이 DOM에서 완전히 사라진 후 포커스 이동 (안정성 확보)
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 0);
      };
    }
  }, [isOpen, onClose]);

  return modalRef;
}