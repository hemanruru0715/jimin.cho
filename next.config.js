module.exports = {
    async headers() {
      return [
        {
          source: '/:all*(jpg|jpeg|png|gif|webp)', // 이미지 파일
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=3600, must-revalidate', // 캐시 설정
            },
          ],
        },
      ];
    },
  };