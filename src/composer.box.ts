module Mp4.Composer.Box {

  export interface IBox {}

  export class BoxComposer extends BaseComposer {
    static type: string;

    constructor() {
      super();
      this.skipBytes(4);
      this.writeString(this['constructor'].type);
    }

    compose(): Uint8Array {
      // write box size;
      this.view.setUint32(0, this.byteOffset);
      return super.compose();
    }
  }


  export interface IFullBox extends IBox {
    version: number;
    flags: number;
  }
  
  export class FullBoxComposer extends BoxComposer {
    constructor(public box: IFullBox) {
      super();
      this.writeUint8(box.version || 0);
      this.writeUint24(box.flags || 0);
    }
  }


  export class BoxListComposer extends BoxComposer {
    constructor(boxes: Uint8Array[]) {
      super();
      boxes.forEach(box => this.writeBytes(box));
    }
  }


  export class FileTypeBoxComposer extends BoxComposer {
    static type = 'ftyp';

    constructor(box: IFileTypeBox) {
      super();
      this.writeString(box.majorBrand);
      this.writeUint32(box.minorVersion);
      box.compatibleBrands.forEach(brand => this.writeString(brand));
    }
  }


  export class MovieBoxComposer extends BoxListComposer {
    static type = 'moov';
  }


  export class MediaDataBoxComposer extends BoxComposer {
    static type = 'mdat';

    constructor(box: IMediaDataBox) {
      super();
      this.writeBytes(box.data);
    }
  }


  export class MovieHeaderBoxComposer extends FullBoxComposer {
    static type = 'mvhd';

    constructor(box: IMovieHeaderBox) {
      super(box);
      this.writeUint32(box.creationTime);
      this.writeUint32(box.modificationTime);
      this.writeUint32(box.timescale);
      this.writeUint32(box.duration);
      this.writeInt32(box.rate);
      this.writeInt16(box.volume);
      this.skipBytes(2);
      this.skipBytes(8);
      box.matrix.forEach(x => this.writeInt32(x));
      this.skipBytes(4 * 6);
      this.writeUint32(box.nextTrackID);
    }
  }


  export class TrackBoxComposer extends BoxListComposer {
    static type = 'trak';
  }


  export class TrackHeaderBoxComposer extends FullBoxComposer {
    static type = 'tkhd';

    constructor(box: ITrackHeaderBox) {
      super(box);
      this.writeUint32(box.creationTime);
      this.writeUint32(box.modificationTime);
      this.writeUint32(box.trackID);
      this.skipBytes(4);
      this.writeUint32(box.duration);
      this.skipBytes(4 * 2);
      this.writeInt16(box.layer);
      this.writeInt16(box.alternateGroup);
      this.writeInt16(box.volume);
      this.skipBytes(2);
      box.matrix.forEach(x => this.writeInt32(x));
      this.writeUint32(box.width);
      this.writeUint32(box.height);
    }
  }


  export class TrackReferenceBoxComposer extends BoxListComposer {
    static type = 'tref';
  }


  export class TrackReferenceTypeBoxComposer extends BoxComposer {
    constructor(box: ITrackReferenceTypeBox) {
      super();
      box.trackIDs.forEach(id => this.writeUint32(id));
    }
  }


  export class HintTrackReferenceTypeBoxComposer extends TrackReferenceTypeBoxComposer {
    static type = 'hint';
  }


  export class DescriptionTrackReferenceTypeBoxComposer extends TrackReferenceTypeBoxComposer {
    static type = 'cdsc';
  }


  export class MediaBoxComposer extends BoxListComposer {
    static type = 'mdia';
  }


  export class MediaHeaderBoxComposer extends FullBoxComposer {
    static type = 'mdhd';

    constructor(box: IMediaHeaderBox) {
      super(box);
      this.writeUint32(box.creationTime);
      this.writeUint32(box.modificationTime);
      this.writeUint32(box.timescale);
      this.writeUint32(box.duration);
      this.skipBits(1);
      [].forEach.call(box.language, (c, i) => this.writeBits(box.language.charCodeAt(i), 5));
      this.skipBytes(2);
    }
  }


  export class HandlerBoxComposer extends FullBoxComposer {
    static type = 'hdlr';

    constructor(box: IHandlerBox) {
      super(box);
      this.skipBytes(4);
      this.writeString(box.handlerType);
      this.skipBytes(4 * 2);
      this.writeUTF8StringNullTerminated(box.name);
    }
  }


  export class MediaInformationBoxComposer extends BoxListComposer {
    static type = 'minf';
  }


  export class VideoMediaHeaderBoxComposer extends FullBoxComposer {
    static type = 'vmhd';

    constructor(box: IVideoMediaHeaderBox) {
      super(box);
      this.writeUint16(box.graphicsmode);
      box.opcolor.forEach(x => this.writeUint16(x));
    }
  }


  export class SoundMediaHeaderBoxComposer extends FullBoxComposer {
    static type = 'smhd';

    constructor(box: ISoundMediaHeaderBox) {
      super(box);
      this.writeInt16(box.balance);
      this.skipBytes(2);
    }
  }


  export class HindMediaHeaderBoxComposer extends FullBoxComposer {
    static type = 'hmhd';

    constructor(box: IHintMediaHeaderBox) {
      super(box);
      this.writeUint16(box.maxPDUsize);
      this.writeUint16(box.avgPDUsize);
      this.writeUint32(box.maxbitrate);
      this.writeUint32(box.avgbitrate);
      this.skipBytes(4);
    }
  }


  export class NullMediaHeaderBoxComposer extends FullBoxComposer {
    static type = 'nmhd';
  }


  export class DataInformationBoxComposer extends BoxListComposer {
    static type = 'dinf';
  }


  export class DataEntryUrlBoxComposer extends FullBoxComposer {
    static type = 'url ';

    constructor(box: IDataEntryUrlBox) {
      super(box);
      this.writeUTF8StringNullTerminated(box.location);
    }
  }


  export class DataEntryUrnBoxComposer extends FullBoxComposer {
    static type = 'urn ';

    constructor(box: IDataEntryUrnBox) {
      super(box);
      this.writeUTF8StringNullTerminated(box.name);
      this.writeUTF8StringNullTerminated(box.location);
    }
  }

  export class DataReferenceBoxComposer extends FullBoxComposer {
    static type = 'dref';

    constructor(box: IDataReferenceBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.entries.forEach(entry => {
        var composer = createBoxComposer(entry);
        this.writeBytes(composer.compose());
      });
    }
  }


  export class SampleTableBoxComposer extends BoxListComposer {
    static type = 'stbl';
  }


  export class TimeToSampleBoxComposer extends FullBoxComposer {
    static type = 'stts';

    constructor(box: ITimeToSampleBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.entries.forEach(entry => {
        this.writeUint32(entry.sampleCount);
        this.writeUint32(entry.sampleDelta);
      });
    }
  }


  export class CompositionOffsetBoxComposer extends FullBoxComposer {
    static type = 'ctts';

    constructor(box: ICompositionOffsetBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.entries.forEach(entry => {
        this.writeUint32(entry.sampleCount);
        this.writeUint32(entry.sampleOffset);
      });
    }
  }


  export class SampleEntryComposer extends BoxComposer {
    constructor(box: ISampleEntry) {
      super();
      this.skipBytes(6);
      this.writeUint16(box.dataReferenceIndex);
    }
  }


  export class HintSampleEntryComposer extends SampleEntryComposer {
    constructor(box: IHintSampleEntry) {
      super(box);
      this.writeBytes(box.data);
    }
  }


  export class VisualSampleEntryComposer extends SampleEntryComposer {
    constructor(box: IVisualSampleEntry) {
      super(box);
      this.skipBytes(2);
      this.skipBytes(2);
      this.skipBytes(4 * 3);
      this.writeUint16(box.width);
      this.writeUint16(box.height);
      this.writeUint32(box.horizresolution);
      this.writeUint32(box.vertresolution);
      this.skipBytes(4);
      this.writeUint16(box.frameCount);
      this.writeString(box.compressorname);
      this.writeUint16(box.depth);
      this.writeUint16(-1);
    }
  }


  export class MP4VisualSampleEntryComposer extends VisualSampleEntryComposer {
    static type = 'mp4v';

    constructor(box: IMP4VisualSampleEntry) {
      super(box);
      this.writeBytes(createBoxComposer(box.esBox).compose());
    }
  }


  export class AudioSampleEntryComposer extends SampleEntryComposer {
    constructor(box: IAudioSampleEntry) {
      super(box);
      this.skipBytes(4 * 2);
      this.writeUint16(box.channelcount);
      this.writeUint16(box.samplesize);
      this.skipBytes(2);
      this.skipBytes(2);
      this.writeUint32(box.samplerate << 16 >>> 0);
    }
  }


  export class MP4AudioSampleEntryComposer extends AudioSampleEntryComposer {
    static type = 'mp4a';

    constructor(box: IMP4AudioSampleEntry) {
      super(box);
      this.writeBytes(createBoxComposer(box.esBox).compose());
    }
  }


  export class SampleDescriptionBoxComposer extends FullBoxComposer {
    static type = 'stsd';

    constructor(box: ISampleDescriptionBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.boxes.forEach(box => {
        var composer = createBoxComposer(box);
        this.writeBytes(composer.compose());
      });
    }
  }


  export class SampleSizeBoxComposer extends FullBoxComposer {
    static type = 'stsz';

    constructor(box: ISampleSizeBox) {
      super(box);
      this.writeUint32(box.sampleSize);
      if (box.sampleSize === 0) {
        box.sampleSizes.forEach(size => this.writeUint32(size));
      }
    }
  }


  export class SampleToChunkBoxComposer extends FullBoxComposer {
    static type = 'stsc';

    constructor(box: ISampleToChunkBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.entries.forEach(entry => {
        this.writeUint32(entry.firstChunk);
        this.writeUint32(entry.samplesPerChunk);
        this.writeUint32(entry.sampleDescriptionIndex);
      });
    }
  }


  export class ChunkOffsetBoxComposer extends FullBoxComposer {
    static type = 'stco';

    constructor(box: IChunkOffsetBox) {
      super(box);
      this.writeUint32(box.entryCount);
      box.chunkOffsets.forEach(offset => this.writeUint32(offset));
    }
  }


  var createBoxComposer = (() => {
    var Composers = {};
    Object.keys(Box).forEach(key => {
      var Composer = Box[key];
      if (Composer.type) Composers[Composer.type] = Composer;
    });
    return (box: IBox): BoxComposer => new Composers[box.type](box);
  })();
}