import { chapter1World } from './config/Chapter1World.js';
import { SaveGameService } from './application/SaveGameService.js';
import { BrowserInput } from './infrastructure/BrowserInput.js';
import { CanvasRenderer } from './infrastructure/CanvasRenderer.js';
import { LocalStorageSaveRepository } from './infrastructure/LocalStorageSaveRepository.js';
import { ManifestAssetProvider } from './infrastructure/ManifestAssetProvider.js';
import { WebAudioPort } from './infrastructure/WebAudioPort.js';
import { GameController } from './presentation/GameController.js';
import { ModalView } from './presentation/ModalView.js';
const canvas = document.querySelector('#game');
const overlay = document.querySelector('#overlay');
const puzzle = document.querySelector('#puzzle');
if (!canvas || !overlay || !puzzle)
    throw new Error('Required DOM nodes are missing.');
const assets = new ManifestAssetProvider();
const controller = new GameController(chapter1World, new BrowserInput(), new CanvasRenderer(canvas, assets), assets, new WebAudioPort(), new ModalView(overlay, puzzle), new SaveGameService(new LocalStorageSaveRepository()));
void controller.start();
