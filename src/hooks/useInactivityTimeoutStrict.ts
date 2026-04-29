import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook para cerrar sesión automáticamente después de 3 minutos de inactividad
 * o cuando el usuario cierra la pestaña/navegador
 */
export const useInactivityTimeoutStrict = (onTimeout?: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInactiveRef = useRef(false);

  const resetTimeout = useCallback(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isInactiveRef.current = false;

    // Establecer nuevo timeout de 3 minutos (180000 ms)
    timeoutRef.current = setTimeout(async () => {
      isInactiveRef.current = true;
      
      // Cerrar sesión
      await supabase.auth.signOut();
      
      if (onTimeout) {
        onTimeout();
      }

      // Redirigir a login
      window.location.href = '/flowsight-ads';
    }, 3 * 60 * 1000); // 3 minutos
  }, [onTimeout]);

  useEffect(() => {
    // Inicializar timeout
    resetTimeout();

    // Eventos que resetean el timeout (actividad del usuario)
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      if (!isInactiveRef.current) {
        resetTimeout();
      }
    };

    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Manejar cierre de pestaña/navegador
    const handleBeforeUnload = async () => {
      // Cerrar sesión al cerrar la pestaña
      await supabase.auth.signOut();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [resetTimeout]);

  return { isInactive: isInactiveRef.current };
};
