import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

type HarnessProps = {
  onConfirm(): void;
  onCancel(): void;
};

function DialogHarness({ onConfirm, onCancel }: HarnessProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = (callback: () => void) => () => {
    callback();
    setIsOpen(false);
  };
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>Remover atividade</button>
      {isOpen && (
        <ConfirmDialog
          title="Remover Caminhada?"
          description="O histórico desta atividade será apagado."
          confirmLabel="Remover"
          tone="danger"
          onConfirm={close(onConfirm)}
          onCancel={close(onCancel)}
        />
      )}
    </>
  );
}

async function openDialog() {
  const user = userEvent.setup();
  const callbacks = { onConfirm: vi.fn(), onCancel: vi.fn() };
  render(<DialogHarness onConfirm={callbacks.onConfirm} onCancel={callbacks.onCancel} />);
  await user.click(screen.getByRole('button', { name: 'Remover atividade' }));
  return { user, ...callbacks };
}

describe('ConfirmDialog', () => {
  it('TU-27: exibe um diálogo modal nomeado pelo título e descrito pelo texto', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog', { name: 'Remover Caminhada?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('O histórico desta atividade será apagado.');
  });

  it('TU-27: leva o foco para o primeiro botão ao abrir', async () => {
    await openDialog();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
  });

  it('TU-27: chama a confirmação ao clicar no botão de confirmar', async () => {
    const { user, onConfirm, onCancel } = await openDialog();
    await user.click(screen.getByRole('button', { name: 'Remover' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('TU-27: cancela e devolve o foco ao gatilho', async () => {
    const { user, onCancel } = await openDialog();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Remover atividade' })).toHaveFocus();
  });

  it('TU-27: fecha com Esc chamando o cancelamento', async () => {
    const { user, onCancel } = await openDialog();
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('TU-27: mantém o foco dentro do diálogo ao navegar com Tab', async () => {
    const { user } = await openDialog();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Remover' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Remover' })).toHaveFocus();
  });
});
