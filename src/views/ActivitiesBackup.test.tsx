import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { serializeBackup } from '../services/backupService';
import { DEFAULT_ACTIVITIES } from '../services/defaultActivities';
import * as fileTransfer from '../services/fileTransfer';
import { LEITURA, makeAppData } from '../test/makeAppData';
import { renderApp } from '../test/renderApp';
import { readStorage, seedStorage } from '../test/storage';

function makeFile(content: string): File {
  return new File([content], 'backup.json', { type: 'application/json' });
}

describe('ActivitiesView — backup e dados', () => {
  it('TI-12: importar arquivo inválido mostra alerta e mantém os dados', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.upload(screen.getByLabelText('Importar backup'), makeFile('{"app":"outro"}'));
    expect(await screen.findByRole('alert')).toHaveTextContent('O arquivo não é um backup válido do Repete Hábito.');
    expect(readStorage()).toEqual(makeAppData());
  });

  it('TI-12: importar arquivo válido pede confirmação antes de substituir os dados', async () => {
    const imported = makeAppData({ activities: [LEITURA], completions: { '2026-10-01': [LEITURA.id] } });
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.upload(screen.getByLabelText('Importar backup'), makeFile(serializeBackup(imported, new Date())));
    const dialog = await screen.findByRole('dialog', { name: 'Substituir seus dados?' });
    expect(dialog).toHaveAccessibleDescription('O backup tem 1 atividade e 1 dia registrado. Seus dados atuais serão substituídos.');
    expect(readStorage()).toEqual(makeAppData());
    await user.click(screen.getByRole('button', { name: 'Substituir dados' }));
    expect(readStorage()).toEqual(imported);
    expect(screen.getByRole('status')).toHaveTextContent('Backup importado com sucesso.');
  });

  it('TI-12: cancelar a importação mantém os dados atuais', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.upload(screen.getByLabelText('Importar backup'), makeFile(serializeBackup(makeAppData({ activities: [] }), new Date())));
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }));
    expect(readStorage()).toEqual(makeAppData());
  });

  it('TI-13: apagar tudo com confirmação volta ao estado de primeiro acesso', async () => {
    seedStorage(makeAppData({ completions: { '2026-10-26': [LEITURA.id] } }));
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Apagar todos os dados' }));
    await user.click(screen.getByRole('button', { name: 'Apagar tudo' }));
    expect(readStorage()).toEqual({ version: 1, activities: [...DEFAULT_ACTIVITIES], completions: {} });
    expect(screen.getByRole('status')).toHaveTextContent('Todos os dados foram apagados.');
  });

  it('TI-13: cancelar o apagar tudo mantém os dados', async () => {
    seedStorage(makeAppData());
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Apagar todos os dados' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(readStorage()).toEqual(makeAppData());
  });

  it('exporta o backup ao clicar no botão', async () => {
    const download = vi.spyOn(fileTransfer, 'downloadTextFile').mockImplementation(() => undefined);
    const { user } = renderApp('/atividades');
    await user.click(screen.getByRole('button', { name: 'Exportar backup' }));
    expect(download).toHaveBeenCalledOnce();
  });
});
