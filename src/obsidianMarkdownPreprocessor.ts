import { BlockProcessor } from './processors/blockProcessor';
import { ExcalidrawProcessor } from './processors/excalidrawProcessor';
import { FootnoteProcessor } from './processors/footNoteProcessor';
import { FormatProcessor } from './processors/formatProcessor';
import { FragmentProcessor } from './processors/fragmentProcessor';
import { GridProcessor } from './processors/gridProcessor';
import { ImageProcessor } from './processors/imageProcessor';
import { InternalLinkProcessor } from './processors/internalLinkProcessor';
import { LatexProcessor } from './processors/latexProcessor';
import { MermaidProcessor } from './processors/mermaidProcessor';
import { MultipleFileProcessor } from './processors/multipleFileProcessor';
import { ObsidianUtils } from './obsidianUtils';
import { Options } from './options';
import { CommentProcessor } from './processors/commentProcessor';
import { DropProcessor } from './processors/dropProcessor';
import { YamlStore } from './yamlStore';
import { AutoClosingProcessor } from './processors/autoClosingProcessor';
import { EmojiProcessor } from './processors/emojiProcessor';
import { IconsProcessor } from './processors/iconsProcessor';
import { DebugViewProcessor } from './processors/debugViewProcessor';
import { CalloutProcessor } from './processors/calloutProcessor';
import { TemplateProcessor } from './processors/templateProcessor';
import { ChartProcessor } from './processors/chartProcessor';

export class ObsidianMarkdownPreprocessor {
	private multipleFileProcessor: MultipleFileProcessor;
	private blockProcessor: BlockProcessor;
	private imageProcessor: ImageProcessor;
	private internalLinkProcessor: InternalLinkProcessor;
	private footnoteProcessor: FootnoteProcessor;
	private latexProcessor: LatexProcessor;
	private formatProcessor: FormatProcessor;
	private excalidrawProcessor: ExcalidrawProcessor;
	private mermaidProcessor: MermaidProcessor;
	private fragmentProcessor: FragmentProcessor;
	private gridProcessor: GridProcessor;
	private commentProcessor: CommentProcessor;
	private dropProcessor: DropProcessor;
	private autoClosingProcessor: AutoClosingProcessor;
	private emojiProcessor: EmojiProcessor;
	private iconsProcessor: IconsProcessor;
	private debugViewProcessor: DebugViewProcessor;
	private calloutProcessor: CalloutProcessor;
	private templateProcessor: TemplateProcessor;
	private chartProcessor: ChartProcessor;

	constructor(utils: ObsidianUtils) {
		this.multipleFileProcessor = new MultipleFileProcessor(utils);
		this.blockProcessor = new BlockProcessor();
		this.imageProcessor = new ImageProcessor(utils);
		this.internalLinkProcessor = new InternalLinkProcessor(utils);
		this.footnoteProcessor = new FootnoteProcessor();
		this.latexProcessor = new LatexProcessor();
		this.formatProcessor = new FormatProcessor();
		this.excalidrawProcessor = new ExcalidrawProcessor(utils);
		this.mermaidProcessor = new MermaidProcessor();
		this.fragmentProcessor = new FragmentProcessor();
		this.gridProcessor = new GridProcessor();
		this.commentProcessor = new CommentProcessor();
		this.dropProcessor = new DropProcessor();
		this.autoClosingProcessor = new AutoClosingProcessor();
		this.emojiProcessor = new EmojiProcessor();
		this.iconsProcessor = new IconsProcessor();
		this.debugViewProcessor = new DebugViewProcessor();
		this.calloutProcessor = new CalloutProcessor();
		this.templateProcessor = new TemplateProcessor(utils);
		this.chartProcessor = new ChartProcessor();
	}
	process(markdown: string, options: Options) {
		YamlStore.getInstance().options = options;


		let before = markdown;
		let after;

		let circuitCounter = 0;
		while (before != after) {
			circuitCounter++;
			if (after) {
				before = after;
			}
			const afterMultipleFileProcessor = this.multipleFileProcessor.process(before);
			after = this.templateProcessor.process(afterMultipleFileProcessor, options);

			if (circuitCounter > 9) {
				console.log('WARNING: Circuit in template hierarchy detected!');
				break;
			}
		}

		const afterDebugViewProcessor = this.debugViewProcessor.process(after, options);
		const afterAutoClosingProcessor = this.autoClosingProcessor.process(afterDebugViewProcessor);
		const afterCalloutProcessor = this.calloutProcessor.process(afterAutoClosingProcessor);
		const afterEmojiProcessor = this.emojiProcessor.process(afterCalloutProcessor);
		const afterIconsProcessor = this.iconsProcessor.process(afterEmojiProcessor);
		const afterDropProcessor = this.dropProcessor.process(afterIconsProcessor, options);
		const afterMermaidProcessor = this.mermaidProcessor.process(afterDropProcessor);
		const afterBlockProcessor = this.blockProcessor.process(afterMermaidProcessor);
		const afterFootNoteProcessor = this.footnoteProcessor.process(afterBlockProcessor, options);
		const afterExcalidrawProcessor = this.excalidrawProcessor.process(afterFootNoteProcessor);
		const afterImageProcessor = this.imageProcessor.process(afterExcalidrawProcessor);
		const afterInternalLinkProcessor = this.internalLinkProcessor.process(afterImageProcessor, options);
		const afterLatexProcessor = this.latexProcessor.process(afterInternalLinkProcessor);
		const afterFormatProcessor = this.formatProcessor.process(afterLatexProcessor);
		const afterFragmentProcessor = this.fragmentProcessor.process(afterFormatProcessor, options);
		const afterGridProcessor = this.gridProcessor.process(afterFragmentProcessor, options);
		const afterCommentProcessor = this.commentProcessor.process(afterGridProcessor);
		const afterChartProcessor = this.chartProcessor.process(afterCommentProcessor, options);
		return afterChartProcessor;
	}
}
