module Mp4 {
  
  export interface IDescriptor {
    tag: number;
    byteLength: number;
    bodyLength: number;
    bytes?: Uint8Array;
  }

  export interface IESDescriptor extends IDescriptor {
    esID: number; // bit(16)
    streamDependenceFlag: number; // bit(1)
    urlFlag: number; // bit(1)
    streamPriority: number; // bit(5)
    dependsOnEsID?: number; // bit(16)
    urlLength?: number; // bit(8)
    urlString?: string;
    decConfigDescr: IDecoderConfigDescriptor;
    slConfigDescr: ISLConfigDescriptor;
    ipiPtr?: IIPIDescriptorPointer;
    ipIDSs?: IIPIdentificationDataSet[];
    ipmpDescrPtrs?: IIPMPDescriptorPointer[];
    langDescrs?: ILanguageDescriptor[];
    qosDescr?: IQosDescriptor;
    extDescrs?: IExtensionDescriptor[];
  }

  export interface IDecoderConfigDescriptor extends IDescriptor {
    objectTypeIndication: number; // bit(8)
    streamType: number; // bit(6)
    upStream: number; // bit(1)
    bufferSizeDB: number; // bit(24)
    maxBitrate: number; // bit(32)
    avgBitrate: number; // bit(32)
    decSpecificInfo?: IDecoderSpecofocInfo;
    profileLevelIndicationIndexDescrs?: IProfileLevelIndicationIndexDescriptor[];
  }

  export interface IDecoderSpecofocInfo extends IDescriptor {

  }

  export interface IProfileLevelIndicationIndexDescriptor extends IDescriptor {
    profileLevelIndicationIndex: number; // bit(8)
  }

  export interface IIPIDescriptorPointer {

  }

  export interface ISLConfigDescriptor extends IDescriptor {
    preDefined: number; // bit(8)
    useAccessUnitStartFlag: number; // bit(1)
    useAccessUnitEndFlag: number; // bit(1)
    useRandomAccessPointFlag: number; // bit(1)
    hasRandomAccessUnitsOnlyFlag: number; // bit(1)
    usePaddingFlag: number; // bit(1)
    useTimeStampsFlag: number; // bit(1)
    useIdleFlag: number; // bit(1)
    durationFlag: number; // bit(1)
    timeStampResolution: number; // bit(32)
    ocrResolution: number; // bit(32)
    timeStampLength: number; // bit(8)
    ocrLength: number; // bit(8)
    auLength: number; // bit(8)
    instantBitrateLength: number; // bit(8)
    degradationPriorityLength: number; // bit(4)
    auSeqNumLength: number; // bit(5)
    packetSeqNumLength: number; // bit(5)
    timeScale?: number; // bit(32)
    accessUnitDuration?: number; // bit(16)
    compositionUnitDuration?: number; // bit(16)
    startDecodingTimeStamp?: number; // bit(timeStampLength)
    startCompositionTimeStamp?: number; // bit(timeStampLength)
  }

  export interface IIPMPDescriptorPointer extends IDescriptor {

  }

  export interface IIPIdentificationDataSet extends IDescriptor {}

  export interface ILanguageDescriptor extends IDescriptor {}

  export interface IQosDescriptor extends IDescriptor {}
  
  export interface IExtensionDescriptor extends IDescriptor {}

  export interface IInitialObjectDescriptor extends IDescriptor {
    objectDescrID: number; // bit(10)
    urlFlag: number; // bit(1)
    includeInlineProfileLevelFlag: number; // bit(1)
    urlLength?: number; // bit(8)
    urlString?: string;
    odProfileLevelIndication?: number; // bit(8)
    sceneProfileLevelIndication?: number; // bit(8)
    audioProfileLevelIndication?: number; // bit(8)
    visualProfileLevelIndication?: number; // bit(8)
    graphicsProfileLevelIndication?: number; // bit(8)
    esDescrs: IESDescriptor[];
    ociDescrs?: IOCIDescriptor[];
    ipmpDescrPtrs?: IIPMPDescriptorPointer[];
    ipmpDescrs?: IIPMPDescriptor[];
    toolListDescr?: IIPMPToolListDescriptor;
    extDescrs?: IExtensionDescriptor[];
  }

  export interface IOCIDescriptor extends IDescriptor {}

  export interface IIPMPDescriptor extends IDescriptor {}

  export interface IIPMPToolListDescriptor extends IDescriptor {}
}