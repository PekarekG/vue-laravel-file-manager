export default {
  methods: {
    /**
     * Bytes to KB, MB, ..
     * @param bytes
     * @returns {string}
     */
    bytesToHuman(bytes) {
      const sizes = ['Bájt', 'KB', 'MB', 'GB', 'TB'];

      if (bytes === 0) return '0 Bájt';

      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

      if (i === 0) return `${bytes} ${sizes[i]}`;

      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    },

    /**
     * Timestamp to date
     * @param timestamp
     * @returns {string}
     */
    timestampToDate(timestamp) {
      // if date not defined
      if (timestamp === undefined) return '-';

      const date = new Date(timestamp * 1000);

      return date.toLocaleString(this.$store.state.fm.settings.lang);
    },

    /**
     * Mime type to icon
     * @param mime
     * @returns {*}
     */
    mimeToIcon(mime) {
      // mime types
      const mimeTypes = {

        // image
        'image/gif': 'mdi-file-image-outline',
        'image/png': 'mdi-file-image-outline',
        'image/jpeg': 'mdi-file-image-outline',
        'image/bmp': 'mdi-file-image-outline',
        'image/webp': 'mdi-file-image-outline',
        'image/tiff': 'mdi-file-image-outline',
        'image/svg+xml': 'mdi-file-image-outline',

        // text
        'text/plain': 'mdi-file-document-outline',

        // code
        'text/javascript': 'mdi-file-code-outline',
        'application/json': 'mdi-file-code-outline',
        'text/markdown': 'mdi-file-code-outline',
        'text/html': 'mdi-file-code-outline',
        'text/css': 'mdi-file-code-outline',

        // audio
        'audio/midi': 'mdi-file-music-outline',
        'audio/mpeg': 'mdi-file-music-outline',
        'audio/webm': 'mdi-file-music-outline',
        'audio/ogg': 'mdi-file-music-outline',
        'audio/wav': 'mdi-file-music-outline',
        'audio/aac': 'mdi-file-music-outline',
        'audio/x-wav': 'mdi-file-music-outline',
        'audio/mp4': 'mdi-file-music-outline',

        // video
        'video/webm': 'mdi-file-video-outline',
        'video/ogg': 'mdi-file-video-outline',
        'video/mpeg': 'mdi-file-video-outline',
        'video/3gpp': 'mdi-file-video-outline',
        'video/x-flv': 'mdi-file-video-outline',
        'video/mp4': 'mdi-file-video-outline',
        'video/quicktime': 'mdi-file-video-outline',
        'video/x-msvideo': 'mdi-file-video-outline',
        'video/vnd.dlna.mpeg-tts': 'mdi-file-video-outline',

        // archive
        'application/x-bzip': 'mdi-archive-outline',
        'application/x-bzip2': 'mdi-archive-outline',
        'application/x-tar': 'mdi-archive-outline',
        'application/gzip': 'mdi-archive-outline',
        'application/zip': 'mdi-archive-outline',
        'application/x-7z-compressed': 'mdi-archive-outline',
        'application/x-rar-compressed': 'mdi-archive-outline',

        // application
        'application/pdf': 'mdi-file-pdf-outline',
        'application/rtf': 'mdi-file-word-outline',
        'application/msword': 'mdi-file-word-outline',

        'application/vnd.ms-word': 'mdi-file-word-outline',
        'application/vnd.ms-excel': 'mdi-file-excel-outline',
        'application/vnd.ms-powerpoint': 'mdi-file-powerpoint-outline',

        'application/vnd.oasis.opendocument.text': 'mdi-file-word-outline',
        'application/vnd.oasis.opendocument.spreadsheet': 'mdi-file-excel-outline',
        'application/vnd.oasis.opendocument.presentation': 'mdi-file-powerpoint-outline',

        'application/vnd.openxmlformats-officedocument.wordprocessingml': 'mdi-file-word-outline',
        'application/vnd.openxmlformats-officedocument.spreadsheetml': 'mdi-file-excel-outline',
        'application/vnd.openxmlformats-officedocument.presentationml': 'mdi-file-powerpoint-outline',
      };

      if (mimeTypes[mime] !== undefined) {
        return mimeTypes[mime];
      }

      // file blank
      return 'mdi-file-outline';
    },

    /**
     * File extension to icon (font awesome)
     * @returns {*}
     * @param extension
     */
    extensionToIcon(extension) {
      // files extensions
      const extensionTypes = {

        // images
        gif: 'mdi-file-image-outline',
        png: 'mdi-file-image-outline',
        jpeg: 'mdi-file-image-outline',
        jpg: 'mdi-file-image-outline',
        bmp: 'mdi-file-image-outline',
        psd: 'mdi-file-image-outline',
        svg: 'mdi-file-image-outline',
        ico: 'mdi-file-image-outline',
        ai: 'mdi-file-image-outline',
        tif: 'mdi-file-image-outline',
        tiff: 'mdi-file-image-outline',

        // text
        txt: 'mdi-file-outline',
        json: 'mdi-file-outline',
        log: 'mdi-file-outline',
        ini: 'mdi-file-outline',
        xml: 'mdi-file-outline',
        md: 'mdi-file-outline',
        env: 'mdi-file-outline',

        // code
        js: 'mdi-file-code-outline',
        php: 'mdi-file-code-outline',
        css: 'mdi-file-code-outline',
        cpp: 'mdi-file-code-outline',
        class: 'mdi-file-code-outline',
        h: 'mdi-file-code-outline',
        java: 'mdi-file-code-outline',
        sh: 'mdi-file-code-outline',
        swift: 'mdi-file-code-outline',

        // audio
        aif: 'mdi-file-music-outline',
        cda: 'mdi-file-music-outline',
        mid: 'mdi-file-music-outline',
        mp3: 'mdi-file-music-outline',
        mpa: 'mdi-file-music-outline',
        ogg: 'mdi-file-music-outline',
        wav: 'mdi-file-music-outline',
        wma: 'mdi-file-music-outline',

        // video
        wmv: 'mdi-file-video-outline',
        avi: 'mdi-file-video-outline',
        mpeg: 'mdi-file-video-outline',
        mpg: 'mdi-file-video-outline',
        flv: 'mdi-file-video-outline',
        mp4: 'mdi-file-video-outline',
        mkv: 'mdi-file-video-outline',
        mov: 'mdi-file-video-outline',
        ts: 'mdi-file-video-outline',
        '3gpp': 'mdi-file-video-outline',

        // archive
        zip: 'mdi-archive-outline',
        arj: 'mdi-archive-outline',
        deb: 'mdi-archive-outline',
        pkg: 'mdi-archive-outline',
        rar: 'mdi-archive-outline',
        rpm: 'mdi-archive-outline',
        '7z': 'mdi-archive-outline',
        'tar.gz': 'mdi-archive-outline',

        // application
        pdf: 'mdi-file-pdf-outline',

        rtf: 'mdi-file-word-outline',
        doc: 'mdi-file-word-outline',
        docx: 'mdi-file-word-outline',
        odt: 'mdi-file-word-outline',

        xlr: 'mdi-file-excel-outline',
        xls: 'mdi-file-excel-outline',
        xlsx: 'mdi-file-excel-outline',

        ppt: 'mdi-file-powerpoint-outline',
        pptx: 'mdi-file-powerpoint-outline',
        pptm: 'mdi-file-powerpoint-outline',
        xps: 'mdi-file-powerpoint-outline',
        potx: 'mdi-file-powerpoint-outline',
      };

      if (extension && extensionTypes[extension.toLowerCase()] !== undefined) {
        return extensionTypes[extension.toLowerCase()];
      }

      // blank file
      return 'mdi-file-outline';
    },
  },
};
