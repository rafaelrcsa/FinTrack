FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/FinTrack.Api/certs/avg-root.crt /usr/local/share/ca-certificates/avg-root.crt
RUN update-ca-certificates

COPY FinTrack.slnx ./
COPY src/FinTrack.Domain/FinTrack.Domain.csproj src/FinTrack.Domain/
COPY src/FinTrack.Infrastructure/FinTrack.Infrastructure.csproj src/FinTrack.Infrastructure/
COPY src/FinTrack.Api/FinTrack.Api.csproj src/FinTrack.Api/
RUN dotnet restore src/FinTrack.Api/FinTrack.Api.csproj

COPY src/ src/
RUN dotnet publish src/FinTrack.Api/FinTrack.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FinTrack.Api.dll"]
