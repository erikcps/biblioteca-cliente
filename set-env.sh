targetPath="./src/environments/environment.$1.ts"

echo "Writing environment file..."
echo $targetPath

cat > $targetPath << EOF
export const environment = {
  production: true,
  apiUrl: "$BACKEND_API_URL",
  hmr: false
};
EOF

cat $targetPath
