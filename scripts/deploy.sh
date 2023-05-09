echo "---------------------------------------"
echo "|        Deployment started...        |"
echo "---------------------------------------"

echo "----------------------------------------"
echo "|        Pulling latest code...        |"
echo "----------------------------------------"
git pull

echo "----------------------------------------"
echo "|        Installing packages...        |"
echo "----------------------------------------"
npm install

echo "-------------------------------------"
echo "|        Building website...        |"
echo "-------------------------------------"
npm run build

echo "--------------------------------------"
echo "|        Restarting server...        |"
echo "--------------------------------------"
pm2 restart e-comerce-customer --update-env

echo "-----------------------------------------"
echo "|        Deployment completed...        |"
echo "-----------------------------------------"
