var Mp4;
(function (Mp4) {
    (function (Parser) {
        var BIT_MASKS = [
            0x00000000, 
            0x00000001, 
            0x00000003, 
            0x00000007, 
            0x0000000F, 
            0x0000001F, 
            0x0000003F, 
            0x0000007F, 
            0x000000FF, 
            0x000001FF, 
            0x000003FF, 
            0x000007FF, 
            0x00000FFF, 
            0x00001FFF, 
            0x00003FFF, 
            0x00007FFF, 
            0x0000FFFF, 
            0x0001FFFF, 
            0x0003FFFF, 
            0x0007FFFF, 
            0x000FFFFF, 
            0x001FFFFF, 
            0x003FFFFF, 
            0x007FFFFF, 
            0x00FFFFFF, 
            0x01FFFFFF
        ];
        var POW25 = Math.pow(2, 25);
        var BaseParser = (function () {
            function BaseParser(bytes) {
                this.bytes = bytes;
                this.bitOffset = 0;
                this.view = new Mp4.DataView2(bytes);
            }
            BaseParser.prototype.parse = function () {
                throw new Error('not implemented error.');
            };
            BaseParser.prototype.readBits = function (n) {
                if(n <= 0) {
                    throw new Error();
                }
                var tmp;
                var byteOffset;
                var needBytes;
                var m;
                var max = 25;
                var ret = 0;
                while(n > 0) {
                    m = n > max ? max : n;
                    ret *= POW25;
                    byteOffset = this.bitOffset >>> 3;
                    needBytes = Math.ceil((this.bitOffset % 8 + m) / 8);
                    switch(needBytes) {
                        case 1:
                            tmp = this.view.getUint8(byteOffset);
                            break;
                        case 2:
                            tmp = this.view.getUint16(byteOffset);
                            break;
                        case 3:
                            tmp = this.view.getUint24(byteOffset);
                            break;
                        case 4:
                            tmp = this.view.getUint32(byteOffset);
                            break;
                    }
                    ret += (tmp >>> (needBytes * 8 - (this.bitOffset % 8 + m))) & BIT_MASKS[m];
                    this.skipBits(m);
                    n -= m;
                }
                return ret;
            };
            BaseParser.prototype.readUint8 = function () {
                var ret = this.view.getUint8(this.getByteOffset());
                this.skipBytes(1);
                return ret;
            };
            BaseParser.prototype.readInt8 = function () {
                var ret = this.view.getInt8(this.getByteOffset());
                this.skipBytes(1);
                return ret;
            };
            BaseParser.prototype.readUint16 = function () {
                var ret = this.view.getUint16(this.getByteOffset());
                this.skipBytes(2);
                return ret;
            };
            BaseParser.prototype.readInt16 = function () {
                var ret = this.view.getInt16(this.getByteOffset());
                this.skipBytes(2);
                return ret;
            };
            BaseParser.prototype.readUint24 = function () {
                var ret = this.view.getUint24(this.getByteOffset());
                this.skipBytes(3);
                return ret;
            };
            BaseParser.prototype.readInt24 = function () {
                var ret = this.view.getInt24(this.getByteOffset());
                this.skipBytes(3);
                return ret;
            };
            BaseParser.prototype.readUint32 = function () {
                var ret = this.view.getUint32(this.getByteOffset());
                this.skipBytes(4);
                return ret;
            };
            BaseParser.prototype.readInt32 = function () {
                var ret = this.view.getInt32(this.getByteOffset());
                this.skipBytes(4);
                return ret;
            };
            BaseParser.prototype.readFloat32 = function () {
                var ret = this.view.getFloat32(this.getByteOffset());
                this.skipBytes(4);
                return ret;
            };
            BaseParser.prototype.readFloat64 = function () {
                var ret = this.view.getFloat64(this.getByteOffset());
                this.skipBytes(8);
                return ret;
            };
            BaseParser.prototype.readBytes = function (n) {
                var byteOffset = this.getByteOffset();
                var ret = this.bytes.subarray(byteOffset, byteOffset + n);
                this.skipBytes(n);
                return ret;
            };
            BaseParser.prototype.readString = function (n) {
                if (typeof n === "undefined") { n = 0; }
                var ret;
                if(n === 0) {
                    var bytes = this.bytes.subarray(this.getByteOffset());
                    ret = String.fromCharCode.apply(null, bytes);
                    n = bytes.length;
                } else {
                    ret = this.view.getString(this.getByteOffset(), n);
                }
                this.skipBytes(n);
                return ret;
            };
            BaseParser.prototype.readStringNullTerminated = function () {
                var bytes = this.bytes.subarray(this.getByteOffset());
                var i = 0;
                while(bytes[i++] === 0) {
                    ;
                }
                this.skipBytes(i);
                return String.fromCharCode.apply(null, bytes.subarray(0, i - 1));
            };
            BaseParser.prototype.readUTF8StringNullTerminated = function () {
                var bytes = this.bytes.subarray(this.getByteOffset());
                var i = 0;
                while(bytes[i++] === 0) {
                    ;
                }
                this.skipBytes(i);
                return new Mp4.DataView2(bytes).getUTF8String(0, i - 1);
            };
            BaseParser.prototype.skipBits = function (n) {
                this.bitOffset += n;
            };
            BaseParser.prototype.skipBytes = function (n) {
                this.bitOffset += n * 8;
            };
            BaseParser.prototype.getByteOffset = function () {
                return this.bitOffset >>> 3;
            };
            BaseParser.prototype.isEnd = function () {
                return this.bitOffset / 8 >= this.bytes.length;
            };
            return BaseParser;
        })();
        Parser.BaseParser = BaseParser;        
    })(Mp4.Parser || (Mp4.Parser = {}));
    var Parser = Mp4.Parser;
})(Mp4 || (Mp4 = {}));
//@ sourceMappingURL=parser.js.map